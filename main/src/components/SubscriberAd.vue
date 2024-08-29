<template>
    <div class="ad">
        <div class="title">
            <div class="titleText">
                <h1><strong>Steakosaurus</strong></h1>
                <p v-if="type == 'money'"><strong style="color: var(--ion-color-tertiary-shade);">$6.99/mo</strong> <span>(+700 pts)</span></p>
                <p v-if="type == 'money'"><span style="color: red; text-decoration: line-through;">$10.00/mo</span></p>
                <p v-else><strong style="color: var(--ion-color-tertiary-shade);">{{ Number(10000).toLocaleString() }} pts</strong> <span>(1 week)</span></p>
            </div>
            <img class="steakosaurus" src="/icons/steakosaurusLeft.svg">
        </div>

        <div class="cards">
            <div class="cardContainer" v-for="card in cards">
                <Transition name="cardAnimation">
                    <div class="cardBackground" v-if="card.show">
                        <div class="card">
                            <div class="header">
                                <img :src="card.img">
                                <h4>{{ card.title }}</h4>
                            </div>
                            <p>{{ card.description }}</p>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <ion-button v-if="type == 'money'" @click="openSubscription" :disabled="loading">Claim Offer</ion-button>
        <ion-button @click="subscribeWithPoints" v-else>Purchase</ion-button>

        <ion-modal :is-open="openSubscriptionModal" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="openSubscriptionModal = false">
          <ion-content>
            <div style="margin-top: 1.5em;"></div>
            <div class="container">
                <h1>Continue</h1>
                
                <div style="width: 92.5%; margin-bottom: 10em;" ref="cardElementPage"></div>
                <div class="buttons">
                    <p v-if="errorMessage != ''">{{ errorMessage }}</p>
                    <ion-button @click="handleSubmit" :color="errorMessage != '' ? 'danger' : 'primary'" :disabled="errorMessage != ''">$6.99/mo</ion-button>
                </div>
                <!--<h1>Payment</h1>

                <p>Enable more payment method types <a href="https://dashboard.stripe.com/settings/payment_methods" target="_blank">in your dashboard</a>.</p>

                <form id="payment-form" @submit.prevent="handleSubmit">
                    <div id="link-authentication-element"></div>
                    <div id="payment-element"></div>
                    <button id="submit" :disabled="isLoading">Pay now</button>
                    <sr-messages :messages="messages" />
                </form>-->
            </div>
            
            <div style="margin-bottom: 1.5em;"></div>
          </ion-content>
        </ion-modal>
    </div>
</template>

<script setup lang="ts">

import { userStore } from '@/stores/userStore';
import { db } from '@/utils/firebase';
import { delay, fetchFromNuxt } from '@/utils/functions';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge,
  onIonViewWillEnter} from '@ionic/vue';
import { loadStripe, Stripe, StripeCardElement, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { doc, getDoc } from 'firebase/firestore';
import { cashOutline } from 'ionicons/icons';
import { watch } from 'vue';
import { onMounted, ref } from 'vue';

const openSubscriptionModal = ref(false);
const isLoading = ref(false);
const messages = ref<string[]> ([]);

const name = ref("");
const clientSecretSave = ref<string> ();

const stripe = ref<Stripe | null> ();
const elements = ref<StripeElements> ();
const cardElement = ref<StripePaymentElement> ();
const cardElementPage = ref<HTMLElement> ();

const loading = ref(true);
const errorMessage = ref("");
watch(() => errorMessage.value, async () => {
    await delay(2000);
    errorMessage.value = "";
});

type Props = {
    type: "money" | "points";
}

const props = defineProps<Props> ();
const emit = defineEmits(["processing", "success", "failed"]);

const cards = ref([{
    img: "/icons/drink.svg",
    title: "Free Beverages",
    description: "Get a free drink of your choice on every reservation at participating stores!",
    show: false
}, {
    img: "/icons/increasePoints.svg",
    title: "50% More Points",
    description: "More points, more fun! Gain 50% more rewards points for every purchase.",
    show: false
}, {
    img: "/icons/pricetag.svg",
    title: "$0 Reservation Fee",
    description: "No caveats, no restrictions. Never pay for a reservation again!",
    show: false
}, {
    img: "/icons/noAdvertisements.svg",
    title: "No Advertisements",
    description: "Advertisements begone! Remove all ads from the Dinersaur app.",
    show: false
}, {
    img: "/icons/shoppingBag.svg",
    title: "Exclusive Deals",
    description: "Get Steakosaurus-exclusive deals and discounts from participating stores!",
    show: false
}]);

onMounted(async () => {
    loading.value = true;

    for (let i in cards.value) {
        if (i == "0") await delay(250);
        else if (i == "1") await delay(200);
        else await delay(600 / Number(i));
        cards.value[i].show = true;
    }

    try {
        const { publishableKey } = await fetchFromNuxt("/api/config");
        stripe.value = await loadStripe(publishableKey);
        
        const { success, message, subscription, clientSecret } = await fetchFromNuxt("/api/create-subscription", JSON.stringify({ uid: userStore().userData?.uid }));
        if (!success) throw new Error(message);

        clientSecretSave.value = clientSecret;
        
        let tries = 0;
        while (tries < 10) {
            if (stripe.value) {
                elements.value = stripe.value.elements({ clientSecret });
                cardElement.value = elements.value.create("payment");
                break;
            }
            tries++;
            await delay(150);
        }

        loading.value = false;

    } catch (error) {
        console.error(error)
    }
});

async function openSubscription () {
    openSubscriptionModal.value = true;

    let tries = 0;
    while (tries < 10) {
        if (cardElementPage.value && cardElement.value) {
            cardElement.value.mount(cardElementPage.value);
            break;
        }
        tries++;
        await delay(150);
    }

    /*const { publishableKey } = await fetchFromNuxt("/api/config");
    stripe.value = await loadStripe(publishableKey);

    const { clientSecret, error: backendError } = await fetchFromNuxt("/api/create-payment-intent");

    if (backendError) messages.value.push(backendError.message);
    messages.value.push(`Client secret returned.`);

    if (stripe.value) {
        elements.value = stripe.value.elements({clientSecret});
        const paymentElement = elements.value.create('payment');
        paymentElement.mount("#payment-element");
        const linkAuthenticationElement = elements.value.create("linkAuthentication");
        linkAuthenticationElement.mount("#link-authentication-element");
        isLoading.value = false;
    }*/
}

async function handleSubmit () {
    try {
        if (!elements.value) throw new Error("Elements not initialized");

        const { error } = await elements.value?.submit();
        if (error) throw new Error(error.message);

        const result = await stripe.value?.confirmPayment({
            elements: elements.value,
            clientSecret: clientSecretSave.value ?? "",
            confirmParams: {
                return_url: `${window.location.origin}`
            },
            redirect: "if_required"
        });

        if (!result) throw new Error();
        if (result.error) throw new Error(result.error.message);
        
        // check firestore
        emit("processing");
        await delay(3000);

        const docData = await getDoc(doc(db, "users", userStore().userData?.uid ?? ""));
        const userData = docData.data();

        if (!userData || !userData.subscription) {
            emit("failed", `Error: User not found.`);
            openSubscriptionModal.value = false;
            return;
        }

        if (userData.subscription.currentlySubscribed) {
            userStore().subscription = userData.subscription;
            userStore().points = userData.points;
            emit("success");
            openSubscriptionModal.value = false;
        } else {
            emit("failed", `Error: Transaction failed.`);
            openSubscriptionModal.value = false;
        }
    
    } catch (error: any) {
        errorMessage.value = error.message ?? "Something went wrong. Try again.";
    }

  /*if (isLoading.value || !stripe.value) return;

  const { clientSecret, error: backendError } = await fetchFromNuxt("https://dinersaur.xyz/api/create-payment-intent");

  isLoading.value = true;

  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    clientSecret,
    confirmParams: {
      return_url: `${window.location.origin}`
    }
  });

  if (error.type === "card_error" || error.type === "validation_error") {
    if (error.message) messages.value.push(error.message);
  } else {
    messages.value.push("An unexpected error occured.");
  }

  isLoading.value = false;*/
}

async function subscribeWithPoints () {
    emit("processing");
    const { success, message } = await fetchFromNuxt("/api/points-subscription", JSON.stringify({ uid: userStore().userData?.uid }));
    if (success) {
        userStore().subscription.currentlySubscribed = true;
        userStore().points = userStore().points - 10000;
        await delay(3000);
        emit("success");
    } else {
        await delay(3000);
        emit("failed", `Error: ${message}`);
    }
}

</script>

<style lang="scss" scoped>

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.ad {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    min-height: 100%;
    height: 50em;
}

.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    width: 95vw;
}

.titleText {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    h1, p {
        margin: 0;
    }

    h1 {
        color: var(--ion-color-primary-shade);
    }
}

.steakosaurus {
    width: 50%;
}

.cards {
    width: 92.5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.5em;
    margin-top: 1em;
}

.cardBackground {
    background: linear-gradient(to top right, var(--ion-color-primary), var(--ion-color-secondary) 85%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1.2em;
    width: 100%;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
}

.cardAnimation-enter-active, .cardAnimation-leave-active {
    transition: all 0.75s ease-in-out;
}

.cardAnimation-enter-from, .cardAnimation-leave-to {
    opacity: 0;
    transform: translateY(15vh);
}

.card {
    background-color: var(--ion-color-light-tint);
    border-radius: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.25em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    width: 97.5%;

    .header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;

        h4 {
            margin: 0;
        }

        img {
            width: 2.25em;
        }
    }

    p {
        margin: 0;
        padding-left: 1.5em;
        padding-right: 1.5em;
        text-align: center;
    }
}

ion-button {
    position: fixed;
    bottom: 1vh;
    width: 92.5%;
}

.buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: fixed;
    bottom: 1vh;
    width: 92.5%;

    p {
        margin: 0;
        margin-bottom: 0.25vh;
        text-align: center;
    }

    ion-button {
        position: static;
        bottom: unset;
    }
}

</style>
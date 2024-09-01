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

        <ion-button v-if="type == 'money'" @click="openSubscription">Claim Offer</ion-button>
        <ion-button @click="subscribeWithPoints" v-else>Purchase</ion-button>

        <ion-modal :is-open="openSubscriptionModal" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="openSubscriptionModal = false">
          <ion-content>
            <p class="powered">Powered by <img src="/icons/stripe.svg"></p>
            <div style="margin-top: 1.5em;"></div>
            <div class="container">
                <h1>Continue</h1>
                
                <div style="width: 92.5%; margin-bottom: 1em;" ref="cardElementPage"></div>
                <div style="width: 92.5%; margin-bottom: 10em;" ref="linkAuthenticationPage"></div>
                <div class="buttons">
                    <p v-if="errorMessage != ''">{{ errorMessage }}</p>
                    <div class="orderSummary">
                        <p>Subtotal: $9.99</p>
                        <p>Discount: $3.00 <ion-icon :icon="pricetag"></ion-icon></p>
                        <div class="divider"></div>
                        <h4>Total: <strong>$6.99</strong></h4>
                    </div>
                    <ion-button @click="handleSubmit" :color="errorMessage != '' ? 'danger' : 'primary'" :disabled="errorMessage != '' || loading">$6.99/mo</ion-button>
                </div>
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
import { loadStripe, Stripe, StripeCardElement, StripeElements, StripeLinkAuthenticationElement, StripePaymentElement } from '@stripe/stripe-js';
import { doc, getDoc } from 'firebase/firestore';
import { cashOutline, pricetag } from 'ionicons/icons';
import { watch } from 'vue';
import { onMounted, ref } from 'vue';

const openSubscriptionModal = ref(false);

const clientSecretSave = ref<string> ();

const stripe = ref<Stripe | null> ();
const elements = ref<StripeElements> ();
const cardElement = ref<StripePaymentElement> ();
const linkAuthenticationElement = ref<StripeLinkAuthenticationElement> ();
const cardElementPage = ref<HTMLElement> ();
const linkAuthenticationPage = ref<HTMLElement> ();

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
    for (let i in cards.value) {
        if (i == "0") await delay(250);
        else if (i == "1") await delay(200);
        else await delay(600 / Number(i));
        cards.value[i].show = true;
    }
});

async function openSubscription () {
    loading.value = true;
    openSubscriptionModal.value = true;

    try {
        const { success, publishableKey } = await fetchFromNuxt("/api/config");
        if (!success) throw new Error;
        stripe.value = await loadStripe(publishableKey);
        
        const { success: success2, message, subscription, clientSecret } = await fetchFromNuxt("/api/create-subscription", JSON.stringify({ uid: userStore().userData?.uid }));
        if (!success2) throw new Error(message);

        clientSecretSave.value = clientSecret;
        
        let tries = 0;
        while (tries < 10) {
            if (stripe.value) {
                elements.value = stripe.value.elements({ clientSecret });
                cardElement.value = elements.value.create("payment");
                linkAuthenticationElement.value = elements.value.create("linkAuthentication");
                break;
            }
            tries++;
            await delay(150);
        }

    } catch (error) {
        console.error(error)
    }

    let tries = 0;
    while (tries < 10) {
        if (cardElementPage.value && cardElement.value && linkAuthenticationElement.value && linkAuthenticationPage.value) {
            cardElement.value.mount(cardElementPage.value);
            linkAuthenticationElement.value.mount(linkAuthenticationPage.value);
            break;
        }
        tries++;
        await delay(150);
    }

    loading.value = false;
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

.powered {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35em;
    position: fixed;
    top: 0;
    left: 0.5em;
    margin: 0;
    color: var(--ion-color-tertiary);

    img {
        width: 3em;
    }
}

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

    .orderSummary {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      width: 100%;

      .divider {
        width: 100%;
        height: 0.15em;
        background-color: var(--ion-color-primary-shade);
        margin-top: 0.5em;
        margin-bottom: 0.5em;
      }

      .subscribed {
        text-decoration: line-through;
        text-decoration-color: var(--ion-color-danger-tint);
        text-decoration-thickness: 0.2em;
      }

      h4 {
        margin-top: 0;
      }
    }
}

</style>
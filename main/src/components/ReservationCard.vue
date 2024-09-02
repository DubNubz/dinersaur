<template>
    <ion-card class="reservation">
        <ion-card-header>
            <ion-card-subtitle>{{ restaurant?.address }}</ion-card-subtitle>
            <ion-card-title>{{ restaurant?.name }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
            <span><ion-icon :icon="timeOutline"></ion-icon> {{ formatTime(reservation.time) }}</span>
            <span><ion-icon :icon="peopleOutline"></ion-icon> Table for <strong>{{ reservation.people }}</strong></span>
            <span v-if="reservation.price"><ion-icon :icon="pricetagsOutline"></ion-icon> <strong>${{ getDecimals(reservation.price) }}</strong></span>
        </ion-card-content>

        <div class="buttons" v-if="!past">
            <ion-button fill="clear" :disabled="reservation.paid" @click="openPayment">{{ reservation.paid ? 'Already paid' : 'Pay now' }}</ion-button>
            <ion-button fill="clear" @click="openRefundModal = true">Cancel</ion-button>
            <ion-button fill="clear" class="more">
                <ion-icon :icon="ellipsisHorizontalCircleOutline"></ion-icon>
            </ion-button>
        </div>

        <div class="buttons" v-else>
            <ion-button fill="clear">View details</ion-button>
        </div>
    </ion-card>

    <ion-modal :is-open="openRefundModal" :initial-breakpoint="0.6" :breakpoints="[0, 0.6]" @didDismiss="openRefundModal = false">
      <ion-content>
        <div class="container">
          <div style="margin-top: 1.5em;"></div>
          <div class="information">
            <h1><ion-icon :icon="backspace"></ion-icon> Cancel Reservation</h1>
            <p>Are you sure you want to cancel this reservation?</p>

            <ion-card class="reservation" style="margin-top: 1.5em;">
              <ion-card-header>
                  <ion-card-subtitle>{{ restaurant?.address }}</ion-card-subtitle>
                  <ion-card-title>{{ restaurant?.name }}</ion-card-title>
              </ion-card-header>

              <ion-card-content>
                  <span><ion-icon :icon="timeOutline"></ion-icon> {{ formatTime(reservation.time) }}</span>
                  <span><ion-icon :icon="peopleOutline"></ion-icon> Table for <strong>{{ reservation.people }}</strong></span>
                  <span v-if="reservation.price"><ion-icon :icon="pricetagsOutline"></ion-icon> <strong>${{ getDecimals(reservation.price) }}</strong></span>
              </ion-card-content>
            </ion-card>

            <div v-if="reservation.paid">
              <div v-if="restaurant?.refundLimit && restaurant.refundLimit != 0 && new Date().getTime() < reservation.time - restaurant.refundLimit"
              @click="openRefundInfoModal = true" class="refundConfirm">
                <h4><ion-icon :icon="shieldCheckmark"></ion-icon> Refund available <ion-icon :icon="informationCircle"></ion-icon></h4>
                <p v-if="restaurant.refundLimit != -1">(Until {{ formatTime(reservation.time - restaurant.refundLimit) }})</p>
              </div>
              <div class="refundConfirm" v-else @click="openRefundInfoModal = true">
                <h4><ion-icon :icon="flashOff"></ion-icon> Refund <strong>not available</strong> <ion-icon :icon="informationCircle"></ion-icon></h4>
                <p v-if="restaurant?.refundLimit">(Expired {{ formatTime(reservation.time - restaurant.refundLimit) }})</p>
              </div>
            </div>

            <div class="closeModal">
              <ion-button fill="clear" @click="startRefund">Confirm</ion-button>
              <ion-button @click="openRefundModal = false">Exit</ion-button>
            </div>
          </div>
          <img style="position: absolute; bottom: 0; height: 40vh;" src="/icons/dinersaurWithShadow.svg">
        </div>
      </ion-content>
    </ion-modal>

    <ion-modal :is-open="openRefundInfoModal" :initial-breakpoint="0.6" :breakpoints="[0, 0.6]" @didDismiss="openRefundInfoModal = false">
      <ion-content>
        <div class="container">
          <div style="margin-top: 1.5em;"></div>
          <div class="information" v-if="restaurant">
            <h1><ion-icon :icon="informationCircleOutline"></ion-icon> Refund Limit</h1>
            <p>Some restaurants do not offer refunds on reservations that are set to begin in the near future.</p>
            <p>For any issues regarding refunds, please contact the restaurant.</p>
            <h3><strong>{{ restaurant.name }}</strong>'s</h3>
            <p style="margin: 0;">refund policy is:</p>
            <h4 v-if="restaurant.refundLimit == -1"><ion-icon :icon="bonfireOutline"></ion-icon> Refund at <strong>any time</strong>!</h4>
            <h4 v-else-if="restaurant.refundLimit == 0"><ion-icon :icon="closeCircleOutline"></ion-icon> <strong>No refunds</strong> at any time.</h4>
            <h4 v-else><ion-icon :icon="hourglassOutline"></ion-icon> <strong>{{ restaurant.refundLimit / 1000 / 60 / 60 }} hours</strong> before reservation.</h4>
            <ion-button class="closeInfo" @click="openRefundInfoModal = false">Understood</ion-button>
          </div>
          <img style="position: absolute; bottom: 0; height: 40vh;" src="/icons/dinersaurWithShadow.svg">
        </div>
      </ion-content>
    </ion-modal>

    <ion-modal ref="outcomeRefundModal" :is-open="showModalRefund" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.65]" @didDismiss="closeModalRefund">
      <ion-header>
        <ion-toolbar>
          <ion-progress-bar type="indeterminate" v-if="!successRefund && !failedRefund"></ion-progress-bar>
        </ion-toolbar>
      </ion-header>
      
      <ion-content>
        <div class="message" v-if="!successRefund && !failedRefund">
          <h1>Processing...</h1>
          <p>Please do not close the app.</p>
        </div>
        
        <Transition name="subscriptionAd">
          <div class="message" v-if="successRefund">
            <h1>Refund successful!</h1>
            <p>You may now close this window.</p>
            <img src="/icons/dinersaurWithShadow.svg">
          </div>
        </Transition>
        
        <div class="message" v-if="failedRefund">
          <h1>Refund failed.</h1>
          <p>{{ failMessage }}</p>
          <p>You may now close this window.</p>
          <img src="/icons/dinersaurWithShadow.svg">
        </div>
      </ion-content>
    </ion-modal>

    <ion-modal :is-open="openPaymentModal" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="openPaymentModal = false">
      <ion-content>
        <p class="powered">Powered by <img src="/icons/stripe.svg"></p>
        <div style="margin-top: 1.5em;"></div>
        <div class="container">
            <h1>Continue</h1>
            
            <div style="width: 92.5%; margin-bottom: 1em;" ref="cardElementPage"></div>
            <div style="width: 92.5%; margin-bottom: 10em;" ref="linkAuthenticationPage"></div>
            <div class="paymentButtons">
                <p v-if="errorMessage != ''">{{ errorMessage }}</p>
                <div class="orderSummary" v-if="price && fee">
                  <p>Subtotal: ${{ userStore().subscription.currentlySubscribed ? getDecimals(price) : getDecimals(price - fee) }}</p>
                  <p @click="openInfoModal = true" :class="{ subscribed: userStore().subscription.currentlySubscribed }">
                    Dinersaur Fee: ${{ getDecimals(fee) }} <ion-icon :icon="informationCircle"></ion-icon>
                  </p>
                  <div class="divider"></div>
                  <h4>Total: <strong>${{ getDecimals(price) }}</strong></h4>
                </div>
                <ion-button @click="handleSubmit" :color="errorMessage != '' ? 'danger' : 'primary'" :disabled="errorMessage != '' || loading">
                  ${{ getDecimals(price ?? 0) }}
                </ion-button>
            </div>
        </div>
        
        <div style="margin-bottom: 1.5em;"></div>
      </ion-content>
    </ion-modal>

    <ion-modal :is-open="openInfoModal" :initial-breakpoint="0.6" :breakpoints="[0, 0.6]" @didDismiss="openInfoModal = false">
      <ion-content>
        <div class="container">
          <div style="margin-top: 1.5em;"></div>
          <div class="information">
            <h1><ion-icon :icon="informationCircleOutline"></ion-icon> Dinersaur Fee</h1>
            <h4 v-if="userStore().subscription.currentlySubscribed" style="color: var(--ion-color-tertiary-shade);">As a <strong>Steakosaur</strong> member, you are exempt from the Dinersaur fee. Thanks for supporting us!</h4>
            <p>The Dinersaur Fee is a (very) small fee that helps pay for our servers, team, and all other operating costs.</p>
            <h3>How is it calculated?</h3>
            <p>Either 5% of your subtotal, or $1.00, whichever is <strong>cheaper</strong>.</p>
            <ion-button class="closeInfo" @click="openInfoModal = false">Understood</ion-button>
          </div>
          <img style="position: absolute; bottom: 0; height: 40vh;" src="/icons/dinersaurWithShadow.svg">
        </div>
      </ion-content>
    </ion-modal>

    <ion-modal ref="outcomeModal" :is-open="showModal" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.65]" @didDismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-progress-bar type="indeterminate" v-if="!success && !failed"></ion-progress-bar>
        </ion-toolbar>
      </ion-header>
      
      <ion-content>
        <div class="message" v-if="!success && !failed">
          <h1>Processing...</h1>
          <p>Please do not close the app.</p>
        </div>
        
        <Transition name="subscriptionAd">
          <div class="message" v-if="success">
            <h1>Payment complete!</h1>
            <p>You may now close this window.</p>
            <img src="/icons/dinersaurWithShadow.svg">
          </div>
        </Transition>
        
        <div class="message" v-if="failed">
          <h1>Transaction failed.</h1>
          <p>{{ failMessage }}</p>
          <p>You may now close this window.</p>
          <img src="/icons/dinersaurWithShadow.svg">
        </div>
      </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">

import { Reservation, RestaurantInfo, userStore } from '@/stores/userStore';
import { db } from '@/utils/firebase';
import { delay, fetchFromNuxt, formatTime } from '@/utils/functions';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar, 
  onIonViewWillEnter} from '@ionic/vue';
import { loadStripe, Stripe, StripeElements, StripeLinkAuthenticationElement, StripePaymentElement } from '@stripe/stripe-js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { backspace, bonfireOutline, closeCircleOutline, ellipsisHorizontalCircleOutline, flashOff, hourglassOutline, informationCircle, informationCircleOutline, peopleOutline, pricetagsOutline, shieldCheckmark, timeOutline } from 'ionicons/icons';
import { onMounted, ref, watch } from 'vue';

type Props = {
    reservation: Reservation;
    past?: boolean;
}

const props = defineProps<Props> ();
const restaurant = ref<RestaurantInfo> ();

const outcomeRefundModal = ref();
const showModalRefund = ref(false);
const successRefund = ref(false);
const failedRefund = ref(false);
const failMessageRefund = ref("");

const outcomeModal = ref();
const showModal = ref(false);
const success = ref(false);
const failed = ref(false);
const failMessage = ref("");

const openPaymentModal = ref(false);
const openInfoModal = ref(false);
const openRefundModal = ref(false);
const openRefundInfoModal = ref(false);

const price = ref(0);
const fee = ref(0);
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

onMounted(async () => {
    loading.value = true;

    try {
      const restaurantDoc = await getDoc(doc(db, "restaurants", props.reservation.restaurant));
      const docData = restaurantDoc.data() as RestaurantInfo;
      restaurant.value = docData;

    } catch (error) {
      console.error(error);
    }

    loading.value = false;
});

async function openPayment () {
    openPaymentModal.value = true;

    try {
        const { success, publishableKey } = await fetchFromNuxt("/api/config");
        if (!success) throw new Error;
        stripe.value = await loadStripe(publishableKey);
        
        const { success: success2, message, clientSecret, amount, fee: dinersaurFee } = await fetchFromNuxt("/api/create-payment-intent",
        JSON.stringify({ uid: userStore().userData?.uid, amount: props.reservation.price }));
        if (!success2) throw new Error(message);

        price.value = amount;
        fee.value = dinersaurFee;
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
        handleProcessing();

        const docData = await getDoc(doc(db, "users", userStore().userData?.uid ?? ""));
        const userData = docData.data();

        if (!userData) {
          await delay(3000);
            handleFail(`Error: User not found.`);
            openPaymentModal.value = false;
            return;
        }
        
        props.reservation.paid = true;
        await updateDoc(doc(db, "users", userStore().userData?.uid ?? ""), {
            currentReservations: [...userData.currentReservations.filter((reservation: Reservation) => reservation.id != props.reservation.id),
            { ...props.reservation, paid: true, paymentId: result.paymentIntent.id }]
        });
        await delay(3000);
        handleSuccess();
        openPaymentModal.value = false;
    
    } catch (error: any) {
        errorMessage.value = error.message ?? "Something went wrong. Try again.";
    }
}

function getDecimals(num: number) {
    if (num % 1 === 0) return num + ".00";
    if (String(num).split(".")[1].length === 1) return num + "0";
    if (String(num).split(".")[1].length > 1) return String(num.toFixed(2));
    return String(num);
}

async function startRefund () {
  handleProcessingRefund();

  try {
    const { success, message } = await fetchFromNuxt("/api/refund-payment", JSON.stringify({
      uid: userStore().userData?.uid,
      paymentId: props.reservation.paymentId,
      refund: ((restaurant.value?.refundLimit != undefined) && (restaurant.value.refundLimit != 0) && (new Date().getTime() < props.reservation.time - restaurant.value.refundLimit))
    }));
    if (!success) throw new Error(message);

    await delay(3000);
    handleSuccessRefund();

  } catch (error: any) {
    await delay(3000);
    handleFailRefund(error.message ?? "Something went wrong. Try again.");
  }
}

function handleProcessingRefund () {
  showModalRefund.value = true;
}

function handleSuccessRefund () {
  outcomeRefundModal.value?.$el.setCurrentBreakpoint(0.65);
  successRefund.value = true;
}

function handleFailRefund (message: string) {
  outcomeRefundModal.value?.$el.setCurrentBreakpoint(0.65);
  failMessageRefund.value = message;
  failedRefund.value = true;
}

function closeModalRefund () {
  showModalRefund.value = false;
  successRefund.value = false;
  failedRefund.value = false;
  openRefundInfoModal.value = false;
  userStore().reservations = userStore().reservations.filter((reservation: Reservation) => reservation.id != props.reservation.id);
}

function handleProcessing () {
  showModal.value = true;
}

function handleSuccess () {
  outcomeModal.value?.$el.setCurrentBreakpoint(0.65);
  success.value = true;
}

function handleFail (message: string) {
  outcomeModal.value?.$el.setCurrentBreakpoint(0.65);
  failMessage.value = message;
  failed.value = true;
}

function closeModal () {
  showModal.value = false;
  success.value = false;
  failed.value = false;
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

.message {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  h1 {
    margin-bottom: 0;
  }

  img {
    width: 75%;
  }
}

ion-card.reservation {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  width: 92.5vw;

  ion-card-content {
    display: flex;
    flex-direction: column;
    
    span {
      text-align: start;
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    ion-button {
      width: 97.5%;
    }
    ion-button.more {
      width: 20%;
      height: 100%;

      ion-icon {
        width: 1em;
        height: 1em;
      }
    }
    ion-button.more::part(native) {
      padding: 0;
    }
  }
}

.closeModal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 40vh;
  width: 92.5%;

  ion-button {
    width: 100%;
  }
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.information {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    width: 92.5%;

    h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25em;
      margin-bottom: 0;
    }

    h3 {
      margin: 0;
      margin-top: 1em;
    }

    p {
      margin: 0;
      margin-top: 0.5em;
    }

    h4 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25em;
    }

    .refundConfirm {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-top: 1em;

      h4 {
        margin: 0;
      }
    }
}

ion-button.closeInfo {
    position: fixed;
    bottom: 40vh;
    width: 92.5%;
}

.paymentButtons {
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
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ion-button {
      width: 100%;
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
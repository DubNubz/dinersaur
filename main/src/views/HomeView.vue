<template>
  <ion-page>
    <Header/>
    <ion-content :fullscreen="true">
      <div class="container">

        <!--<h1>Payment</h1>

    <p>
      Enable more payment method types
      <a
        href="https://dashboard.stripe.com/settings/payment_methods"
        target="_blank"
      >in your dashboard</a>.
    </p>

    <form
      id="payment-form"
      @submit.prevent="handleSubmit"
    >
      <div id="link-authentication-element" ></div>
      <div id="payment-element" ></div>
      <button
        id="submit"
        :disabled="isLoading"
      >
        Pay now
      </button>
      <sr-messages :messages="messages" />
    </form>-->

        <PointsBar :delay="750" />

        <h1>{{ $t("welcome", { name: userStore().name }) }}</h1>

        <Transition name="subscriptionAd">
          <ion-card class="subscription" v-if="showSubscriptionAd">
            <img src="/icons/steakosaurusRight.svg" alt="">
            <ion-card-header>
              <ion-card-subtitle>50% more points +<ion-badge color="secondary">FREE</ion-badge> drinks by becoming a</ion-card-subtitle>
              <ion-card-title>Steakosaurus Supreme</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Upgrade today and gain 50% more points on every purchase, a free drink at every reservation*, and more Steakosaurus-exclusive benefits!
            </ion-card-content>
            <ion-button @click="openSubscriptionModal = true">Try now</ion-button>
          </ion-card>
        </Transition>

        <ion-modal :is-open="openSubscriptionModal" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="openSubscriptionModal = false">
          <ion-content>
            <div style="margin-top: 1.5em;"></div>
            <SubscriberAd :type="'money'" />
          </ion-content>
        </ion-modal>

        <div class="reservations" v-if="userStore().reservations.length != 0">
          <h2>{{ $t("upcoming") }}</h2>
          <div class="reservationsList">
            <ion-card class="reservation" v-for="reservation in userStore().reservations">
              <ion-card-header>
                <ion-card-subtitle>{{ reservation.restaurant.address }}</ion-card-subtitle>
                <ion-card-title>{{ reservation.restaurant.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <span><ion-icon :icon="timeOutline"></ion-icon> {{ formatTime(reservation.time) }}</span>
                <span><ion-icon :icon="peopleOutline"></ion-icon> Table for <strong>{{ reservation.people }}</strong></span>
                <span><ion-icon :icon="pricetagsOutline"></ion-icon> <strong>${{ reservation.price }}</strong></span>
              </ion-card-content>
              <div class="buttons">
                <ion-button fill="clear" :disabled="reservation.paid">Pay now</ion-button>
                <ion-button fill="clear">Cancel</ion-button>
                <ion-button fill="clear" class="more">
                  <ion-icon :icon="ellipsisHorizontalCircleOutline"></ion-icon>
                </ion-button>
              </div>
            </ion-card>
          </div>
        </div>

        <div class="reservations" v-if="userStore().pastReservations.length != 0">
          <h2>{{ $t("past") }}</h2>
          <div class="reservationsList">
            <ion-card class="reservation" v-for="reservation in userStore().pastReservations">
              <ion-card-header>
                <ion-card-subtitle>{{ reservation.restaurant.address }}</ion-card-subtitle>
                <ion-card-title>{{ reservation.restaurant.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <span><ion-icon :icon="timeOutline"></ion-icon> {{ formatTime(reservation.time) }}</span>
                <span><ion-icon :icon="peopleOutline"></ion-icon> Table for <strong>{{ reservation.people }}</strong></span>
                <span><ion-icon :icon="pricetagsOutline"></ion-icon> <strong>${{ reservation.price }}</strong></span>
              </ion-card-content>
              <div class="buttons">
                <ion-button fill="clear">View details</ion-button>
              </div>
            </ion-card>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, 
  onIonViewWillEnter} from '@ionic/vue';
import Header from '@/components/Header.vue';
import { Reservation, userStore } from '@/stores/userStore';
import { addCustomMethods, delay, fetchFromNuxt, formatTime } from '@/utils/functions';
import { time } from 'console';
import { ellipsisHorizontalCircle, ellipsisHorizontalCircleOutline, peopleOutline, pricetagsOutline, timeOutline } from 'ionicons/icons';
import SubscriberAd from '@/components/SubscriberAd.vue';

import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import SrMessages from '@/components/SrMessages.vue';
import PointsBar from '@/components/PointsBar.vue';

addCustomMethods();

/*const isLoading = ref(false);
const messages = ref<string[]> ([]);

const stripe = ref<Stripe | null> ();
const elements = ref<StripeElements> ();*/

const openSubscriptionModal = ref(false);
const showSubscriptionAd = ref(false);

onIonViewDidEnter(async () => {
  await delay(1250);
  if (!userStore().subscribed) showSubscriptionAd.value = true;

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
});

/*async function handleSubmit () {
  if (isLoading.value || !stripe.value) return;

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

  isLoading.value = false;
}*/



</script>

<style lang="scss" scoped>

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

ion-card.subscription {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: all 0.75s;
  --background: #f6f0ff;
  --color: black;

  ion-card-header, ion-card-content {
    width: 100%;

    ion-card-subtitle {
      --color: var(--ion-color-tertiary);
      display: flex;
      align-items: center;
      gap: 0.25em;
    }
  }

  ion-button {
    width: 97.5%;
    --background: var(--ion-color-secondary-tint);
    --color: black;
  }

  img {
    background: linear-gradient(to top, transparent, rgba(76, 80, 12, 0.05) 50%);
    padding-left: 12.5%;
    padding-right: 12.5%;
  }
}

.subscriptionAd-enter-active, .subscriptionAd-leave-active {
  transition: opacity 0.5s ease;
}

.subscriptionAd-enter-from, .subscriptionAd-leave-to {
  opacity: 0;
  transform: translate(-50vw);
}

.reservations {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  h2 {
    margin-top: 2em;
  }
}

.reservationList {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
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

</style>
<template>
  <ion-page>
    <Header/>
    <ion-content :fullscreen="true">
      <div class="container">

        <PointsBar :delay="750" :show-link="true" />

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
            <SubscriberAd :type="'money'" @processing="handleProcessing" @success="handleSuccess" @failed="(msg) => handleFail(msg)" />
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
                <h1>Congratulations!</h1>
                <h4>Enjoy your new Steakosaurus perks and benefits!</h4>
                <p>You may now close this window.</p>
                <img src="/icons/steakosaurusRight.svg">
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

        <div class="reservations" v-if="userStore().reservations.length != 0">
          <h2>{{ $t("upcoming") }}</h2>
          <p>Showing 1 of <strong>{{ userStore().reservations.length.toLocaleString() }}</strong></p>
          <p @click="openReservation('upcoming')"><span>View all</span></p>
          <div class="reservationsList">
            <ReservationCard :reservation="[...userStore().reservations].sort((a, b) => a.time - b.time)[0]" />
          </div>
        </div>

        <div class="reservations" v-if="userStore().pastReservations.length != 0">
          <h2>{{ $t("past") }}</h2>
          <p>Showing 1 of <strong>{{ userStore().pastReservations.length.toLocaleString() }}</strong></p>
          <p @click="openReservation('past')"><span>View all</span></p>
          <div class="reservationsList">
            <ReservationCard :reservation="[...userStore().pastReservations].sort((a, b) => b.time - a.time)[0]" :past="true" />
          </div>
        </div>

        <ion-modal :is-open="openReservationModal" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="openReservationModal = false">
          <ion-content>
            <div style="margin-top: 1.5em;"></div>
            <AllReservations :type="typeOfReservation" />
          </ion-content>
        </ion-modal>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar,
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
import ReservationCard from '@/components/ReservationCard.vue';
import AllReservations from '@/components/AllReservations.vue';

addCustomMethods();

const outcomeModal = ref();

const showModal = ref(false);
const success = ref(false);
const failed = ref(false);
const failMessage = ref("");

const openSubscriptionModal = ref(false);
const showSubscriptionAd = ref(false);
const openReservationModal = ref(false);
const typeOfReservation = ref<"upcoming" | "past"> ("upcoming");

onIonViewDidEnter(async () => {
  await delay(1250);
  if (!userStore().subscription.currentlySubscribed) showSubscriptionAd.value = true;
});

function openReservation (type: "upcoming" | "past") {
  openReservationModal.value = true;
  typeOfReservation.value = type;
}

function handleProcessing () {
  showModal.value = true;
}

function handleSuccess () {
  openSubscriptionModal.value = false;
  outcomeModal.value?.$el.setCurrentBreakpoint(0.65);
  success.value = true;
}

function handleFail (message: string) {
  openSubscriptionModal.value = false;
  outcomeModal.value?.$el.setCurrentBreakpoint(0.65);
  failMessage.value = message;
  failed.value = true;
}

function closeModal () {
  showModal.value = false;
  if (success.value) showSubscriptionAd.value = false;
  success.value = false;
  failed.value = false;
}

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

.reservations {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  h2 {
    margin-top: 1em;
  }

  p {
    margin: 0;

    span {
      color: var(--ion-color-tertiary-shade);
      text-decoration: underline;
    }
  }
}

.reservationsList {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin-top: 0.5em;
}

</style>
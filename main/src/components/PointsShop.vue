<template>
    <div class="container">

      <PointsBar :delay="100" />

      <h2>Deals & Offers</h2>

      <Transition name="subscriptionAd">
        <div class="offers" v-if="showSubscriptionAd">
          <ion-card class="subscription">
            <img src="/icons/steakosaurusRight.svg" alt="">
            <ion-card-header>
              <ion-card-subtitle>50% more points +<ion-badge color="secondary">FREE</ion-badge> drinks by becoming a</ion-card-subtitle>
              <ion-card-title>1 Week of Steakosaurus</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Gain 50% more points on every purchase, a free drink at every reservation*, and more Steakosaurus-exclusive benefits for 1 week!
            </ion-card-content>
            <ion-button @click="openSubscriptionModal = true" :disabled="userStore().points < 10000">{{ Number(10000).toLocaleString() }} pts</ion-button>
          </ion-card>
            
          <ion-modal :is-open="openSubscriptionModal" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="openSubscriptionModal = false">
            <ion-content>
              <div style="margin-top: 1.5em;"></div>
              <SubscriberAd :type="'points'" @processing="handleProcessing" @success="handleSuccess" @failed="(msg) => handleFail(msg)" />
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
                  <h4>Enjoy your week of Steakosaurus perks and benefits!</h4>
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
        </div>
      </Transition>
      
      <Transition name="subscriptionAd">
        <div class="offers" v-if="restaurantsWithOffers.length > 0">
          <div v-for="restaurant in restaurantsWithOffers">
            <ion-card class="offer" v-for="offer in restaurant.offers">
              <ion-card-header>
                <ion-card-subtitle>{{ restaurant.address }}</ion-card-subtitle>
                <ion-card-title>{{ restaurant.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <span><ion-icon :icon="timeOutline"></ion-icon> Expires <strong v-if="offer.expires">{{ formatTime(offer.expires, true) }}</strong><strong v-else>never</strong></span>
                <span><ion-icon :icon="ticketOutline"></ion-icon> Use code <strong>{{ offer.code }}</strong> at checkout</span>
                <span>{{ offer.description }}</span>
              </ion-card-content>
              <div class="buttons">
                <ion-button>Shop now</ion-button>
              </div>
            </ion-card>
          </div>
        </div>
      </Transition>

      <div class="offers" v-if="!showSubscriptionAd && restaurantsWithOffers.length == 0">
        <p>It's quiet here. Check back later for new offers!</p>
      </div>

    </div>
</template>

<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar,
  onIonViewWillEnter} from '@ionic/vue';
import { PointOffer, RestaurantInfo, userStore } from '@/stores/userStore';
import { delay, formatTime, getRestaurants } from '@/utils/functions';
import { onMounted, ref, watch } from 'vue';
import SubscriberAd from './SubscriberAd.vue';
import PointsBar from './PointsBar.vue';
import { ticketOutline, timeOutline } from 'ionicons/icons';

const outcomeModal = ref();

const openSubscriptionModal = ref(false);
const showSubscriptionAd = ref(false);

const showModal = ref(false);
const success = ref(false);
const failed = ref(false);
const failMessage = ref("");

const restaurantsWithOffers = ref<RestaurantInfo[]> ([]);

onMounted(async () => {
  await delay(100);
  if (!userStore().subscribed) showSubscriptionAd.value = true;
  if (userStore().nearbyRestaurants.length != 0) restaurantsWithOffers.value = userStore().nearbyRestaurants.filter((restaurant) => restaurant.offers);
  else {
    const restaurants = await getRestaurants() as RestaurantInfo[];
    userStore().nearbyRestaurants = restaurants;
    restaurantsWithOffers.value = restaurants.filter((restaurant) => restaurant.offers);
  }
});

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
  showSubscriptionAd.value = false;
}

</script>

<style lang="scss" scoped>

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.offers {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 92.5vw;
}

ion-card.subscription {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  --background: #f6f0ff;
  --color: black;
  width: 100%;

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

ion-card.offer {
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

.subscriptionAd-enter-active, .subscriptionAd-leave-active {
  transition: all 0.5s ease;
}

.subscriptionAd-enter-from, .subscriptionAd-leave-to {
  opacity: 0;
  transform: translateY(15vh);
}

</style>
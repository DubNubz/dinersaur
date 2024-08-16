<template>
  <ion-page>
    <Header/>
    <ion-content :fullscreen="true">
      <div class="container">

        <div class="pointsCounter">
          <h4><strong>{{ points.toLocaleString() }}</strong> pts</h4>
          <div class="points">
            <div class="circle" :style="{ left: calculateCirclePosition(points) }">
              <div class="innerCircle"></div>
            </div>
            <div class="bar" :style="{ width: Math.floor((1 - ((points / 10000) > 0.075 ? (points / 10000) : 0.05)) * 100) + '%' }"></div>
          </div>
          <div class="counter"><span :class="{ bold: number <= points }" v-for="number in [1000, 3000, 5000, 7000, 9000]">{{ number }}</span></div>
        </div>

        <h1>{{ $t("welcome", { name: userStore().name }) }}</h1>

        <Transition name="subscriptionAd">
          <ion-card class="subscription" v-if="showSubscriptionAd">
            <img src="/icons/steakosaurusRight.svg" alt="">
            <ion-card-header>
              <ion-card-subtitle>50% more points + 10% off by becoming a</ion-card-subtitle>
              <ion-card-title>Steakosaurus Supreme</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Upgrade today and gain 50% more points on every purchase!
            </ion-card-content>
            <ion-button>Try now</ion-button>
          </ion-card>
        </Transition>

        <div class="reservations" v-if="userStore().reservations.length != 0">
          <h2>{{ $t("upcoming") }}</h2>
          <div class="reservationsList">
            <ion-card class="reservation" v-for="reservation in userStore().reservations">
              <ion-card-header>
                <ion-card-subtitle>{{ reservation.address }}</ion-card-subtitle>
                <ion-card-title>{{ reservation.restaurantName }}</ion-card-title>
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
                <ion-card-subtitle>{{ reservation.address }}</ion-card-subtitle>
                <ion-card-title>{{ reservation.restaurantName }}</ion-card-title>
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
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, 
  onIonViewWillEnter} from '@ionic/vue';
import Header from '@/components/Header.vue';
import { Reservation, userStore } from '@/stores/userStore';
import { addCustomMethods, delay } from '@/utils/functions';
import { time } from 'console';
import { ellipsisHorizontalCircle, ellipsisHorizontalCircleOutline, peopleOutline, pricetagsOutline, timeOutline } from 'ionicons/icons';

addCustomMethods();

const points = ref(0);
const showSubscriptionAd = ref(false);

onIonViewDidEnter(async () => {
  await delay(500);
  points.value = userStore().points;
  await delay(500);
  if (!userStore().subscribed) showSubscriptionAd.value = true;
});

function calculateCirclePosition (points: number) {
  if (points <= 1700 && points >= 1200) return Math.floor(((points / 10000) + 0.025) * 100) + '%';
  else if (points < 4500) return Math.floor((((points / 10000) > 0.075 ? (points / 10000) : 0.075)) * 100) + '%';
  else if (points < 8000) return Math.floor(((points / 10000) - 0.025) * 100) + '%';
  else if (points < 9500) return Math.floor(((points / 10000) - 0.05) * 100) + '%';
  else return '89%';
}

function formatTime (time: number) {
  const hour = new Date(time).getHours();
  const minutes = new Date(time).getMinutes();

  let date: string;
  if (new Date(time).getDate() == new Date().getDate()) date = 'Today';
  else if (new Date(time).getDate() == new Date().getDate() + 1) date = 'Tomorrow';
  else if (new Date(time).getDate() == new Date().getDate() - 1) date = 'Yesterday';
  else date = new Date(time).toLocaleDateString();

  return `${date} at ${hour}:${minutes < 10 ? '0' + minutes : minutes} ${hour < 12 ? 'AM' : 'PM'}`;
}

</script>

<style lang="scss" scoped>

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.pointsCounter {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  width: 90vw;
  gap: 0.5em;
  margin-top: 1em;

  h4 {
    margin: 0;
  }
}

.points {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 90vw;
  height: 1em;
  background: linear-gradient(to right, var(--ion-color-primary), var(--ion-color-secondary) 70%);
  border-radius: 2em;

  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.2em;
    height: 1.2em;
    background-color: var(--ion-color-tertiary);
    border-radius: 1.2em;
    position: absolute;
    z-index: 1;
    transition: all 0.75s;

    .innerCircle {
      width: 1em;
      height: 1em;
      background-color: var(--ion-color-light);
      border-radius: 1em;
    }
  }

  .bar {
    height: 100%;
    border-top-right-radius: 2em;
    border-bottom-right-radius: 2em;
    background-color: var(--ion-color-light-shade);
    position: relative;
    transition: all 0.75s;
  }
}

.counter {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;

  .bold {
    font-weight: 700;
  }
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
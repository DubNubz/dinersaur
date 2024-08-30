<template>
    <ion-card class="reservation">

        <ion-card-header>
            <ion-card-subtitle>{{ reservation.restaurant.address }}</ion-card-subtitle>
            <ion-card-title>{{ reservation.restaurant.name }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
            <span><ion-icon :icon="timeOutline"></ion-icon> {{ formatTime(reservation.time) }}</span>
            <span><ion-icon :icon="peopleOutline"></ion-icon> Table for <strong>{{ reservation.people }}</strong></span>
            <span><ion-icon :icon="pricetagsOutline"></ion-icon> <strong>${{ getDecimals(reservation.price) }}</strong></span>
        </ion-card-content>

        <div class="buttons" v-if="!past">
            <ion-button fill="clear" :disabled="reservation.paid">{{ reservation.paid ? 'Already paid' : 'Pay now' }}</ion-button>
            <ion-button fill="clear">Cancel</ion-button>
            <ion-button fill="clear" class="more">
                <ion-icon :icon="ellipsisHorizontalCircleOutline"></ion-icon>
            </ion-button>
        </div>

        <div class="buttons" v-else>
            <ion-button fill="clear">View details</ion-button>
        </div>

    </ion-card>
</template>

<script setup lang="ts">

import { Reservation, userStore } from '@/stores/userStore';
import { formatTime } from '@/utils/functions';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, 
  onIonViewWillEnter} from '@ionic/vue';
import { ellipsisHorizontalCircleOutline, peopleOutline, pricetagsOutline, timeOutline } from 'ionicons/icons';

type Props = {
    reservation: Reservation;
    past?: boolean;
}

const props = defineProps<Props> ();

function getDecimals(num: number) {
    if (num % 1 === 0) return num + ".00";
    if (String(num).split(".")[1].length === 1) return num + "0";
    if (String(num).split(".")[1].length > 1) return String(num.toFixed(2));
    return String(num);
}

</script>

<style lang="scss" scoped>

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
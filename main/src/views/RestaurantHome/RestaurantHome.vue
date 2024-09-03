<template>
  <ion-page>
    <Header :type="'restaurant'" />
    <ion-content>
      <div class="page">
        <h1>Reservation Requests</h1>
        <div class="card">
          <div class="itemBackground" v-for="request in userStore().restaurantReservations.incoming.filter((reservation) => !reservation.accepted)">
            <div class="item">
              <div class="info">
                <p><ion-icon :icon="timeOutline"></ion-icon> {{ formatTime(request.time) }}</p>
                <p><ion-icon :icon="peopleOutline"></ion-icon> Table for <strong>{{ request.people }}</strong></p>
                <p v-if="request.price"><ion-icon :icon="pricetagsOutline"></ion-icon> $<strong>{{ getDecimals(request.price) }}</strong></p>
                <p v-else><ion-icon :icon="walletOutline"></ion-icon> No order yet</p>
                <p v-if="request.allergies.length != 0"><ion-icon :icon="medkitOutline"></ion-icon> View <strong>{{ request.allergies.length }}</strong> allergies</p>
                <p v-else><ion-icon :icon="leafOutline"></ion-icon> <strong>No allergies</strong></p>
              </div>
              <div class="acceptButtons">
                <button><ion-icon :icon="checkmark" color="success"></ion-icon> Accept</button>
                <button><ion-icon :icon="close" color="danger"></ion-icon> Decline</button>
              </div>
            </div>
          </div>
        </div>

        <!-- incoming reservations -->
        <!-- revenue -->
        <!-- total customers -->
        <!-- active advertisements -->
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { watch, ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar,
  onIonViewWillEnter} from '@ionic/vue';
import Header from '@/components/Header.vue';
import { userStore } from '@/stores/userStore';
import { formatTime } from '@/utils/functions';
import { checkmark, close, leafOutline, medicalOutline, medkitOutline, peopleOutline, pricetagsOutline, timeOutline, walletOutline } from 'ionicons/icons';

function getDecimals(num: number) {
    if (num % 1 === 0) return num + ".00";
    if (String(num).split(".")[1].length === 1) return num + "0";
    if (String(num).split(".")[1].length > 1) return String(num.toFixed(2));
    return String(num);
}

</script>

<style lang="scss" scoped>

.page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5em;
  width: 92.5%;
}

.itemBackground {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 3px;
  border-radius: 1.2em;
  background: linear-gradient(to top left, var(--ion-color-primary), var(--ion-color-secondary-tint) 85%);
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.825);
  padding: 0.5em;
  border-radius: 1em;
}

.info {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  width: 100%;

  h4, p {
    margin: 0;
  }
}

.acceptButtons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;

  button {
    background-color: transparent;

    ion-icon {
      width: 2.5em;
      height: 2.5em;
    }
  }
}

</style>

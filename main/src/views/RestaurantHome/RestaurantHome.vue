<template>
  <ion-page>
    <Header :type="'restaurant'" />
    <ion-content>
      <div class="page">
        <div class="card">
          <h1>Reservation Requests</h1>
          <div class="list">
            <div class="item" v-for="request in userStore().restaurantReservations.incoming">
              <h4>{{ formatTime(request.time) }}</h4>
              <p>{{ request.people }}</p>
              <p v-if="request.price">${{ getDecimals(request.price) }}</p>
              
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

</style>

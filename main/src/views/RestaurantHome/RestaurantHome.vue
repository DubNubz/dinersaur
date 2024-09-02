<template>
  <ion-page>
    <Header :type="'restaurant'" />
    <ion-content>
      <div class="page">
        <div class="card">
          <h1>Reservation Requests</h1>
          <div class="list">
            <div class="item" v-for="request in requests">

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

import { watch, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar,
  onIonViewWillEnter} from '@ionic/vue';
import Header from '@/components/Header.vue';
import { Reservation } from '@/stores/userStore';

const requests = ref<Reservation[]> ();

</script>

<style lang="scss" scoped>

.page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

}

</style>

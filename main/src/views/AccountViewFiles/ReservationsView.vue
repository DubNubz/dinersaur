<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/pages/account"></ion-back-button>
        </ion-buttons>
        <ion-title>Reservations</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="page">

        <h2>{{ $t("upcoming") }}</h2>
        <p v-if="userStore().reservations.length == 0">Nothing here yet. Try booking a reservation!</p>
        <div class="reservations" v-else>
          <p>Showing 1 of <strong>{{ userStore().reservations.length.toLocaleString() }}</strong></p>
          <p @click="openReservation('upcoming')"><span>View all</span></p>
          <div class="reservationsList">
            <ReservationCard :reservation="[...userStore().reservations].sort((a, b) => a.time - b.time)[0]" />
          </div>
        </div>

        <h2>{{ $t("past") }}</h2>
        <p v-if="userStore().pastReservations.length == 0">Nothing here yet. Try booking a reservation!</p>
        <div class="reservations" v-else>
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

import AllReservations from '@/components/AllReservations.vue';
import ReservationCard from '@/components/ReservationCard.vue';
import { userStore } from '@/stores/userStore';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonModal } from '@ionic/vue';
import { ref } from 'vue';

const openReservationModal = ref(false);
const typeOfReservation = ref<"upcoming" | "past"> ("upcoming");

function openReservation (type: "upcoming" | "past") {
  openReservationModal.value = true;
  typeOfReservation.value = type;
}

</script>

<style lang="scss" scoped>

.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
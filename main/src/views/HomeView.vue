<template>
  <ion-page>
    <Header/>
    <ion-content :fullscreen="true">
      <div class="divOne">
        <ion-title>Upcoming Reservations</ion-title>
      </div>
      <div class="divTwo">
        <p v-if="arrayOfReservations.length == 0">No Upcoming Reservations!</p>
        <p v-else-if="arrayOfReservations.length == 1">You have 1 upcoming reservation!</p>
        <p v-else>You have {{ arrayOfReservations.length }} upcoming reservations!</p>
      </div>
      <div class="divThree">
        <ion-card v-for="reservation in arrayOfReservations" :key="reservation.id">
          <ion-card-header>
            <ion-card-title>{{ reservation.title }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{ reservation.content }}
          </ion-card-content>
        </ion-card>
      </div>
      <div class="divider"></div>
      <div class="divFour">
        <ion-title>Past Reservations</ion-title>
        <ion-card v-for="reservation in arrayOfPastReservations" :key="reservation.id">
          <ion-card-header>
            <ion-card-title>{{ reservation.title }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{ reservation.content }}
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg } from '@ionic/vue';
import Header from '@/components/Header.vue';

const arrayOfReservations = ref<Array<{ title: string, content: string, id: string }>>([]); // we should probably import these or make these global variables
const arrayOfPastReservations = ref<Array<{ title: string, content: string, id: string }>>([]);

const newCard = {
  title: "number1restaurant",
  content: "at 6pm tn",
  id: "1",
}
arrayOfReservations.value.push(newCard);
arrayOfReservations.value.push(newCard);
arrayOfReservations.value.push(newCard);

</script>

<style lang="scss" scoped>

.divOne{
  display: flex;
  margin-top: 15px;
}

.divTwo{
  display: flex;
  align-items: center;
  justify-content: center;
}

.divThree{
  display: flex;
  align-items: flex-start;
}

.divider{
  width: 95vw;
  height: 1px;
  margin: 10px;
  background-color: black;
}

.divFour{
  display: flex;
  align-items: flex-start;
}

</style>
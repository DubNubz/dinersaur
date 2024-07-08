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
        <div class="subDivThree">
          <ion-card v-for="reservation in arrayOfReservations" :key="reservation.id">
            <ion-card-header>
              <ion-card-title>{{ reservation.title }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              {{ reservation.content }}
            </ion-card-content>
          </ion-card>
        </div>
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

      <GoogleMap api-key="AIzaSyCMXfre823EDS2YC_BfExnrJWnQmTObOFI" style="width: 100%; height: 500px" :center="center" :zoom="15">
        <Marker :options="{ position: center }" />
      </GoogleMap>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle} from '@ionic/vue';
import Header from '@/components/Header.vue';
import { userStore } from '@/stores/userStore';
import { GoogleMap, Marker } from 'vue3-google-map';

const center = ref({ lat: 40.689247, lng: -74.044502 });

const arrayOfReservations = userStore().reservations;
const arrayOfPastReservations = userStore().pastReservations;

const newCard = {
  title: "number1restaurant",
  content: "at 6pm tn",
  id: "1",
}
arrayOfReservations.push(newCard, newCard, newCard);

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
  flex-wrap: nowrap;
  align-items: flex-start;
  overflow-x: scroll;
  white-space: nowrap;
  margin-left: 10px;
  margin-right: 10px;
  padding-bottom: 10px;
}

.subDivThree{
  display: flex;
  flex-wrap: nowrap;
  overflow-x: visible;
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

ion-card{
  flex: 0 0 auto;
  width: 250px; 
  margin-bottom: 0;
  margin-top: 0;
}

</style>
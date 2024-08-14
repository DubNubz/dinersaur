<template>
  <ion-page>
    <Header/>
    <ion-content :fullscreen="true">
      <div class="divOne">
        <h1>{{ $t("welcome", { name: userStore().name }) }}</h1>
      </div>
      <div class="divOne">
        <ion-title>{{ $t("upcoming") }}</ion-title>
      </div>
      <div class="divTwo">
        <p v-if="arrayOfReservations.length == 0">{{ $t("none") }}</p>
        <p v-else-if="arrayOfReservations.length == 1">{{ $t("one") }}!</p>
        <p v-else>{{ $t("many", { count: arrayOfReservations.length }) }}!</p>
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
        <ion-title>{{ $t("past") }}</ion-title>
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle} from '@ionic/vue';
import Header from '@/components/Header.vue';
import { Reservation, userStore } from '@/stores/userStore';
import { addCustomMethods } from '@/utils/functions';

addCustomMethods();

const center = ref({ lat: 40.689247, lng: -74.044502 });

const arrayOfReservations = ref<Reservation[]> ([]);
const arrayOfPastReservations = ref<Reservation[]> ([]);

watch(() => userStore().reservations, () => arrayOfReservations.value = userStore().reservations);
watch(() => userStore().pastReservations, () => arrayOfPastReservations.value = userStore().pastReservations);

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
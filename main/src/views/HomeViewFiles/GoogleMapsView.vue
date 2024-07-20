<template>
    <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Discover</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <my-map
        :markerData="markerData"
        @onMarkerClicked="openModel">
      </my-map>

      <ion-modal
        :is-open="markerIsOpen"
        @didDismiss="closeModal"
        :initial-breakpoint="0.25"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
      >
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ selectedMarker?.title }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <p>{{ selectedMarker?.snippet }}</p>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonModal, IonButtons, IonButton} from "@ionic/vue";

import { ref } from "vue";
import MyMap from "./MyMap.vue";

const selectedMarker = ref<Marker | null>(null);
const markerIsOpen = ref<boolean>(false);

type Marker = {
  coordinate: any,
  title: string,
  snippet: string, 
}

const markerData = ref<Marker[]>([
    {
    coordinate: { lat: 37.769, lng: -122.446 },
    title: "title one",
    snippet: "title one snippet content will be presented here",
  },
]);

function openModel(marker: Marker) {
  selectedMarker.value = marker;
  markerIsOpen.value = true;
}

function closeModal(){
  selectedMarker.value = null;
  markerIsOpen.value = false;
}

</script>

<style lang="scss" scoped>

ion-content {
  overflow: hidden;
}

</style>
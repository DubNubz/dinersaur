<template>
    <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Map</ion-title>
      </ion-toolbar>
      <ion-searchbar
          placeholder="Search location..."
          v-model="search"
          :debounce="500"
        ></ion-searchbar>
    </ion-header>

    <ion-content>
      <ion-list v-if="results.length > 0" class="dropdown-list">
        <ion-item
          v-for="result in results"
          :key="result.title"
          @click="chooseWithinList(result)"
        >
          {{ result.title }}
        </ion-item>
      </ion-list>

      <my-map v-if="loaded"
        :markerData="markerData"
        @onMarkerClicked="openModel"
        :querySelect="querySelect">
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

import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonModal, IonButtons, IonButton, IonSearchbar, IonItem, IonList } from "@ionic/vue";

import { onMounted, ref, watch } from "vue";
import MyMap from "./MyMap.vue";
import { Marker, RestaurantInfo } from "@/stores/userStore";
import { db } from "@/utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Geolocation } from "@capacitor/geolocation";

const loaded = ref(false);

const search = ref("");
watch(() => search.value, async () => await onSearch());

const selectedMarker = ref<Marker | null>(null);
const markerIsOpen = ref<boolean>(false);

const markerData = ref<Marker[]>([]);
const results = ref<Marker[]>([]);
const querySelect = ref<{ lat: number; lng: number; booleanValue: boolean }> ();

onMounted(async () => {
  loaded.value = false;
  await fetchNearbyMarkers();
});

function openModel(marker: Marker) {
  selectedMarker.value = marker;
  markerIsOpen.value = true;
}

function closeModal(){
  selectedMarker.value = null;
  markerIsOpen.value = false;
}

async function onSearch() {
  const queryText = search.value;

  if (queryText) {
    const restaurantCollection = collection(db, "restaurants");
    const q = query(restaurantCollection, where("name", ">=", queryText), where("name", "<=", queryText + "\uf8ff"));
    
    const querySnapshot = await getDocs(q);

    const searchResults: Marker[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      searchResults.push({
        coordinate: { lat: data.location.latitude, lng: data.location.longitude },
        title: data.name,
        snippet: data.address,
      });
    });
    markerData.value = searchResults;
    results.value = searchResults;
  } else {
    fetchNearbyMarkers();
  }
}

async function chooseWithinList(chosenMarker: Marker) {
  querySelect.value = {
      lat: chosenMarker.coordinate.lat,
      lng: chosenMarker.coordinate.lng,
      booleanValue: true,
  };

  results.value = [];
}

async function fetchNearbyMarkers() {
  const position = await Geolocation.getCurrentPosition();
  const userLat = position.coords.latitude;
  const userLng = position.coords.longitude;

  const restaurantCollection = collection(db, "restaurants");
  const querySnapshot = await getDocs(restaurantCollection);

  const nearbyMarkers: Marker[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data() as RestaurantInfo;
    const distance = calculateDistance(userLat, userLng, data.location.latitude, data.location.longitude);

    if (distance <= 2) { // 20 miles radius
      nearbyMarkers.push({
        coordinate: { lat: data.location.latitude, lng: data.location.longitude },
        title: data.name,
        snippet: data.address,
      });
    }
  });

  markerData.value = nearbyMarkers;
  loaded.value = true;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthRadius = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance;
}

</script>

<style lang="scss" scoped>

ion-content {
  overflow: hidden;
}

.dropdown-list {
  position: absolute;
  width: 100%;
  z-index: 1000;
  background-color: white;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

ion-item {
  cursor: pointer;
}

</style>
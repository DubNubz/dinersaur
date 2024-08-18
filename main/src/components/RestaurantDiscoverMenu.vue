<template>
 <ion-menu side="start" menu-id="second" content-id="discover">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu Categories</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item v-for="(category, index) in userStore().categories" :key="index" :class="{selected: index === selectedIndex}" @click="filterByCategory(category), selectedIndex = index">
          <ion-label>{{ category }}</ion-label>
        </ion-item>
        <ion-item @click="filterByCategory(null)">
          <ion-label>Show All</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">

import { IonMenu, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonLabel, IonTitle } from '@ionic/vue';
import { userStore } from '@/stores/userStore';
import { ref } from 'vue';

const selectedIndex = ref(0);

function filterByCategory(category: string | null){
  userStore().selectedCategory = category;
}

</script>

<style scoped>
.selected {
    color: var(--ion-color-primary, #fff);
}

</style>
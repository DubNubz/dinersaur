<template>
  <ion-menu side="start" menu-id="first" content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Floors</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item 
          v-for="(floor, index) in userStore().floors" 
          :key="index" 
          @click="selectFloor(index)" 
          :class="{ selected: index === userStore().selectedFloorIndex }"> 
          <ion-label>{{ floor.name }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonMenu, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonLabel, IonTitle } from '@ionic/vue';
import { userStore } from '@/stores/userStore';

function selectFloor(index: number) {
    userStore().selectedFloorIndex = index;
}
</script>


<style scoped>

.selected {
    color: var(--ion-color-primary, #fff);
}

</style>
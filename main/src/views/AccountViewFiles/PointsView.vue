<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/pages/account"></ion-back-button>
        </ion-buttons>
        <ion-title>Points</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">

      <PointsShop />

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import PointsShop from '@/components/PointsShop.vue';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, onIonViewDidEnter, IonModal } from '@ionic/vue';
import { ref } from 'vue';

</script>

<style lang="scss" scoped>

</style>
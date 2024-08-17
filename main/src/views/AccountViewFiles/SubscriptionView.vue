<template>
    <ion-page>
      
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/pages/account"></ion-back-button>
          </ion-buttons>
          <ion-title>Steakosaurus</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="ion-padding">

        <SubscriberAd v-if="!userStore().subscribed" />

        <div v-else class="page">
          <h1>Page Two</h1>
          <p>Use the back button to navigate to the previous page.</p>
        </div>

      </ion-content>

    </ion-page>
  </template>
  
  <script setup lang="ts">
  
  import SubscriberAd from '@/components/SubscriberAd.vue';
import { userStore } from '@/stores/userStore';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
  
  </script>
  
  <style lang="scss" scoped>
  
  </style>
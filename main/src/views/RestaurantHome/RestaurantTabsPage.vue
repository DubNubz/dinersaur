<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/restaurant/home">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/restaurant/account">
          <ion-icon aria-hidden="true" :icon="compassOutline" />
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/restaurant/edit">
          <ion-icon aria-hidden="true" :icon="restaurantOutline" />
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/restaurant/account">
          <ion-icon aria-hidden="true" :icon="settingsOutline" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">

import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { homeOutline, personCircleOutline, buildOutline, gridOutline, settingsOutline, restaurantOutline, videocamOutline, compassOutline } from 'ionicons/icons';

</script>

<style lang="scss" scoped>



</style>

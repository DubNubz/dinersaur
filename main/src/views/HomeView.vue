<template>
  <ion-page>
    <Header />

    <ion-content :fullscreen="true">
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg } from '@ionic/vue';
import Header from '@/components/Header.vue';

</script>

<style lang="scss" scoped>



</style>
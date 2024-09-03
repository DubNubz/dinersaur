<template>
    <div class="component">
        <h1>stats</h1>
    </div>
</template>

<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar,
  onIonViewWillEnter} from '@ionic/vue';
import { userStore } from '@/stores/userStore';
import { ref, watch, onMounted } from 'vue';

</script>

<style lang="scss" scoped>

.component {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

</style>
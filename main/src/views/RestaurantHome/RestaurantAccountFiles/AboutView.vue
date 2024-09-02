<template>
    <ion-page>
        <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
            <ion-back-button default-href="/restaurant/account"></ion-back-button>
            </ion-buttons>
            <ion-title>Version History</ion-title>
        </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
        <ion-list>
            <ion-item>v1.00.00000</ion-item>
            <ion-item>The Era of Dinersaur Begins! Added functionality to the entire app!</ion-item>
        </ion-list>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';

</script>

<style lang="scss" scoped>

</style>
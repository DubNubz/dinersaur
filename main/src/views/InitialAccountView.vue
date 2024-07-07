<template>
    <ion-page>
        <ion-nav :root="AccountView"></ion-nav>
    </ion-page>
</template>

<script setup lang="ts">

import { IonPage, IonNav } from '@ionic/vue';
import AccountView from './AccountView.vue';

</script>

<style lang="scss" scoped>

</style>
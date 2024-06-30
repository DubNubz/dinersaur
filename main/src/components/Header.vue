<template>
    <ion-header>
        <ion-toolbar class="title">
          <div class="logo">
            <ion-img src="/icons/dinersaurWithShadow.svg" alt="Dinersaur"></ion-img>
            <ion-title :class="{ disabled: searchBarActive }">Dinersaur</ion-title>
          </div>
        </ion-toolbar>
        <ion-toolbar class="search">
          <ion-searchbar v-model="currentSearch" inputmode="search" enterkeyhint="search" @ion-focus="searchBarActive = true" @ion-blur="searchBarActive = false" class="searchbar"></ion-searchbar>
        </ion-toolbar>
    </ion-header>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg } from '@ionic/vue';

const searchBarActive = ref(false);
const currentSearch = ref("");

watch(() => currentSearch.value, () => search());

function search () {

}

</script>

<style lang="scss" scoped>

ion-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  transition: all 0.25s;
  width: 100vw;
  height: 6em;
}

.title {
  width: fit-content;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding-right: 0.5em;

  ion-img {
    width: 5em;
    height: 5em;
  }

  ion-title {
    padding: 0;
  }
}

.disabled {
  display: none;
}

.search {
  transition: all 0.25s;
}

ion-searchbar.searchbar {
  transition: all 0.25s;
}

</style>
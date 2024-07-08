<template>
    <ion-header :class="{ enabledHeader: searchBarActive }">
        <ion-toolbar class="title">
          <div class="logo">
            <ion-img src="/icons/dinersaurWithShadow.svg" alt="Dinersaur"></ion-img>
            <ion-title class="dinersaurText sequel" :class="{ disabled: searchBarActive }">Dinersaur</ion-title>
          </div>
        </ion-toolbar>
        <ion-toolbar class="search" :class="{ enabled: searchBarActive }">
          <ion-searchbar v-model="currentSearch" inputmode="search" enterkeyhint="search" show-clear-button="focus" @ion-focus="searchBarActive = true" @ion-blur="searchBarActive = false" class="searchbar"></ion-searchbar>
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
  transition: all 0.25s;
  width: 100vw;
  height: 5.5em;
}

ion-header.enabledHeader {
  justify-content: space-between;
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

ion-title.dinersaurText {
  width: 110px;
  transition: all 0.15s;
}

ion-title.disabled {
  width: 0px;
}

.search {
  width: 50%;
  transition: all 0.25s;
}

.enabled {
  width: 75%;
}

ion-searchbar.searchbar {
  transition: all 0.25s;
}

</style>
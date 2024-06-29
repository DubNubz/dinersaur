<template>
  <ion-page>
    <ion-header>
      <div class="header">
        <ion-toolbar class="title" :class="{ disabled: searchBarActive }">
          <ion-title>Dinersaur</ion-title>
        </ion-toolbar>
        <ion-toolbar class="search">
          <ion-searchbar v-model="currentSearch" inputmode="search" enterkeyhint="search" @ion-focus="searchBarActive = true" @ion-blur="searchBarActive = false" class="searchbar"></ion-searchbar>
        </ion-toolbar>
      </div>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar } from '@ionic/vue';

const searchBarActive = ref(false);
const currentSearch = ref("");

watch(() => currentSearch.value, () => search());

function search () {

}

</script>

<style lang="scss" scoped>

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  transition: all 0.25s;
}

.title {
  width: fit-content;
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
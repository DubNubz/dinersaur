<template>
  <ion-page ref="page">

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/pages/account"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ $t("yourAllergies") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <h1>{{ $t("yourAllergies") }}</h1>
      <ion-list>
        <ion-item v-for="allergy in currentAllergies">
          <ion-label>{{ allergy }}</ion-label>
        </ion-item>
        <ion-item v-if="currentAllergies.length == 0">
          <ion-label>{{ $t("noAllergies") }}</ion-label>
        </ion-item>
      </ion-list>

      <ion-button @click="openModal">{{ $t("editAllergies") }}</ion-button>

      <ion-modal :is-open="editAllergiesMenu" :initial-breakpoint="0.8" :breakpoints="[0, 0.5, 0.8, 1]" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ $t("editAllergies") }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">{{ $t("done") }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <h1 style="text-align: center;">{{ $t("selectAll") }}</h1>
          <ion-searchbar v-model="search" inputmode="search" enterkeyhint="search"></ion-searchbar>

          <ion-label v-if="currentAllergies.length != 0">{{ $t("yourAllergies") }}</ion-label>
          <ion-list v-if="currentAllergies.length != 0">
            <ion-item v-for="allergy in [...currentAllergies].sort().filter((allergyInList) => allergyInList.toLowerCase().includes(search))">
              <ion-checkbox :checked="true" @click="addAllergyToList(allergy)">{{ allergy }}</ion-checkbox>
            </ion-item>
          </ion-list>

          <ion-label>{{ $t("allAllergies") }}</ion-label>
          <ion-list>
            <ion-item>
              <ion-input label="Custom allergy" label-placement="floating" counter :maxlength="50" placeholder="Enter an allergy"></ion-input>
            </ion-item>
            <ion-item v-for="allergy in [...loadedAllergies].sort().filter((allergyInList) => (!currentAllergies.includes(allergyInList)) && allergyInList.toLowerCase().includes(search))">
                <ion-checkbox :checked="currentAllergies.includes(allergy)" @click="addAllergyToList(allergy)">{{ allergy }}</ion-checkbox>
            </ion-item>
          </ion-list>
          <ion-infinite-scroll @ionInfinite="loadNewAllergies">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-content>
      </ion-modal>

    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonIcon, IonSearchbar, IonList,
  IonItem, IonCheckbox, IonModal, onIonViewDidEnter, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, 
  InfiniteScrollCustomEvent} from '@ionic/vue';
import { allergies } from '@/utils/allergies';
import { userStore } from '@/stores/userStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const page = ref();

const editAllergiesMenu = ref(false);

const loadedAllergies = ref<string[]> ([]);
const allergyLoader = getAllergies();

const search = ref("");
watch(() => search.value, (newSearch) => search.value = newSearch.toLowerCase());

const helperAllergiesList = ref<string[]> ([]);
const currentAllergies = ref<string[]> ([]);

onMounted(() => {
  currentAllergies.value = userStore().currentAllergies;
  allergyLoader.next();
});

function* getAllergies () {
  let i = 0;
  while (true) {
    if (i % 20 == 0 && i != 0) yield;
    if (!allergies[i]) {
      yield;
      continue;
    }

    loadedAllergies.value.push(allergies[i]);
    i++;
  }
}

function loadNewAllergies (event: InfiniteScrollCustomEvent) {
  allergyLoader.next();
  setTimeout(() => event.target.complete(), 500);
}

function openModal () {
  helperAllergiesList.value = [...currentAllergies.value];
  editAllergiesMenu.value = true;
}

async function closeModal () {
  currentAllergies.value = [...helperAllergiesList.value];
  editAllergiesMenu.value = false;
  helperAllergiesList.value = [];
  search.value = "";
  userStore().currentAllergies = currentAllergies.value;
  
  try {
    const userData = userStore().userData;
    if (!userData) return;
    await updateDoc(doc(db, "users", userData.uid), {
      allergies: currentAllergies.value
    });

  } catch (error) {
    console.error(error);
  }

}

function addAllergyToList (newAllergy: string) {
  if (!helperAllergiesList.value.includes(newAllergy)) helperAllergiesList.value.push(newAllergy);
  else {
    const index = helperAllergiesList.value.findIndex((existingAllergy) => existingAllergy == newAllergy);
    helperAllergiesList.value.splice(index, 1);
  }
}

</script>

<style lang="scss" scoped>

</style>
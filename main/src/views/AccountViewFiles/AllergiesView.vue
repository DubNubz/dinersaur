<template>
  <ion-page ref="page">

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/pages/account"></ion-back-button>
        </ion-buttons>
        <ion-title>Your Allergies</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <h1>Your allergies</h1>
      <ion-list>
        <ion-item v-for="allergy in currentAllergies">
          <ion-label>{{ allergy }}</ion-label>
        </ion-item>
        <ion-item v-if="currentAllergies.length == 0">
          <ion-label>None. Click the button below to add some!</ion-label>
        </ion-item>
      </ion-list>

      <ion-button @click="openModal">Edit Allergies</ion-button>

      <ion-modal :is-open="editAllergiesMenu" :presenting-element="page">
        <ion-header>
          <ion-toolbar>
            <ion-title>Edit Allergies</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Done</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <h1>Select all that apply</h1>
          <ion-searchbar v-model="search" inputmode="search" enterkeyhint="search"></ion-searchbar>

          <ion-label v-if="currentAllergies.length != 0">Your Allergies</ion-label>
          <ion-list v-if="currentAllergies.length != 0">
            <ion-item v-for="allergy in [...currentAllergies].sort().filter((allergyInList) => allergyInList.toLowerCase().includes(search))">
              <ion-checkbox :checked="true" @click="addAllergyToList(allergy)">{{ allergy }}</ion-checkbox>
            </ion-item>
          </ion-list>

          <ion-label>All Allergies</ion-label>
          <ion-list>
            <ion-item v-for="allergy in [...allergies].sort().filter((allergyInList) => (!currentAllergies.includes(allergyInList)) && allergyInList.toLowerCase().includes(search))">
                <ion-checkbox :checked="currentAllergies.includes(allergy)" @click="addAllergyToList(allergy)">{{ allergy }}</ion-checkbox>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>

    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonIcon, IonSearchbar, IonList, IonItem, IonCheckbox, IonModal } from '@ionic/vue';
import { allergies } from '@/utils/allergies';
import { userStore } from '@/stores/userStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const search = ref("");
watch(() => search.value, (newSearch) => search.value = newSearch.toLowerCase());

const helperAllergiesList = ref<string[]> ([]);
const currentAllergies = ref(userStore().currentAllergies);
const editAllergiesMenu = ref(false);
const page = ref();

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
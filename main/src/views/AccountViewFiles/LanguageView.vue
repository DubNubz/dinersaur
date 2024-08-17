<template>
  <ion-page>

    <Transition name="fade">
      <DinersaurLoad v-if="showDinersaur" :barPercent="loadingBarPercentage" :destination="null" />
    </Transition>

    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/pages/account"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ $t("language") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>{{ $t("selectLanguage") }}!</h1>
      <p>{{ $t("powered") }}</p>
      <h4><strong>{{ $t("gTranslate") }}</strong><img aria-hidden="true" src="/icons/googleTranslate.svg" alt=""></h4>
      <ion-list>
        <ion-item button v-for="language in languages" @click="changeLanguage(language.code)" :class="{ currentLang: locale === language.code }">
          <ion-icon aria-hidden="true" :icon="language.flag" size="large" slot="start"></ion-icon>
          <ion-label>{{ $t(language.name) }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">

import DinersaurLoad from '@/components/DinersaurLoad.vue';
import { userStore } from '@/stores/userStore';
import { db } from '@/utils/firebase';
import { delay } from '@/utils/functions';
import { IonPage, IonHeader, IonFab, IonFabButton, IonIcon, IonToolbar, IonTitle, IonContent, onIonViewDidLeave, onIonViewDidEnter, IonButton,
  IonButtons, IonModal, IonToast, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, 
  InfiniteScrollCustomEvent, IonAvatar, IonInput, onIonViewWillEnter, createAnimation, IonRippleEffect, IonBackButton } from '@ionic/vue';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { languages } from '@/utils/languages';

const loadingBarPercentage = ref(10);
const showDinersaur = ref(false);

const { locale } = useI18n();

async function changeLanguage (language: string) {
  if (locale.value === language) return;
  loadingBarPercentage.value = 10;
  showDinersaur.value = true;
  await delay(150);

  locale.value = language;
  userStore().language = language;

  try {
    const userData = userStore().userData;
    if (userData) {
      loadingBarPercentage.value += 10;
      await updateDoc(doc(db, "users", userData.uid), { language });
      loadingBarPercentage.value += 10;
    }

  } catch (error) {
    console.error(error);
  }

  while (loadingBarPercentage.value < 100) {
    loadingBarPercentage.value += 10;
    await delay(60);
  }
  await delay(500);
  showDinersaur.value = false;
}

</script>

<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

h1, h4, p {
  text-align: center;
  margin-bottom: 0;
}

h4 {
  margin-top: 0;
  margin-bottom: 1vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;

  img {
    height: 4vh;
  }
}

ion-item.currentLang {
  --background: var(--ion-color-secondary);
}

</style>
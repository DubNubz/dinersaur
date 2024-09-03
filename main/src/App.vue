<template>
  <ion-app>
    <RestaurantMapMenu/>
    <RestaurantDiscoverMenu/>

    <Transition name="fade">
      <DinersaurLoad v-if="showDinersaur" :barPercent="loadingBarPercentage" :destination="null" />
    </Transition>

    <ion-fab v-if="['/chooseAccount', '/restaurantLogin', '/login'].includes(router.currentRoute.value.path)" slot="fixed" horizontal="end" vertical="top">
      <ion-fab-button @click="openModal">
        <ion-icon :icon="language"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <ion-modal :is-open="showModal" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">{{ $t("done") }}</ion-button>
          </ion-buttons>
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
    </ion-modal>

    <ion-router-outlet />

  </ion-app>
</template>

<script setup lang="ts">

import { IonApp, IonRouterOutlet, IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonIcon, IonSearchbar, IonList,
  IonItem, IonCheckbox, IonModal, onIonViewDidEnter, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonFab, IonFabButton, IonMenu, 
  InfiniteScrollCustomEvent,
  onIonViewWillEnter} from '@ionic/vue';
import { language } from 'ionicons/icons';
import router from './router';
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { languages } from '@/utils/languages';
import { delay } from './utils/functions';
import { userStore } from './stores/userStore';
import DinersaurLoad from './components/DinersaurLoad.vue';
import { allergies } from './utils/allergies';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './utils/firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import RestaurantMapMenu from '@/components/RestaurantMapMenu.vue';
import RestaurantDiscoverMenu from './components/RestaurantDiscoverMenu.vue';

const loadingBarPercentage = ref(10);
const showDinersaur = ref(false);
const showModal = ref(false);

const { locale } = useI18n();

onBeforeMount(async () => {
  const store = userStore();

  const storedLang = localStorage.getItem("lang");
  const storedName = localStorage.getItem("name");

  if (storedLang) store.language = storedLang;
  if (storedName) store.name = storedName;
});

onAuthStateChanged(getAuth(), async (user) => {
  if (user) {
    const store = userStore();
    store.userData = user;
    const docData = await getDoc(doc(db, "users", user.uid));
    const userData = docData.data();
    if (!userData) {
      getRestaurantDetails(user);
      return;
    }
    localStorage.setItem("lang", userData.language);
    localStorage.setItem("name", userData.name);

    if (userData.allergies != undefined) {
      store.currentAllergies = userData.allergies;
      store.billing = userData.billing;
      store.reservations = userData.currentReservations;
      store.language = userData.language;
      store.name = userData.name;
      store.pastReservations = userData.pastReservations;
      store.rating = userData.rating;
      store.smProfile = userData.smProfile;
      store.notifications = userData.notifications;
      store.points = userData.points;
      store.subscription = userData.subscription;
    } else {
      
    }

    locale.value = store.language;
  }
});

async function getRestaurantDetails (user: User) {
  const docData = await getDoc(doc(db, "restaurants", user.uid));
  const userData = docData.data();
  if (!userData) return;

  userStore().restaurant = {
    name: userData.name,
    address: userData.address,
    email: userData.email,
    id: userData.id,
    location: userData.location,
    menu: userData.menu,
    offers: userData.offers,
    phone: userData.phone,
    refundLimit: userData.refundLimit,
    modal: userData.modal,
    rating: userData.rating,
    layout: userData.layout
  };
  userStore().restaurantReservations.incoming = userData.reservations.incoming;
  userStore().restaurantReservations.past = userData.reservations.past;
}

async function changeLanguage (language: string) {
  if (locale.value === language) return;
  loadingBarPercentage.value = 10;
  showDinersaur.value = true;
  await delay(150);

  locale.value = language;
  userStore().language = language;

  while (loadingBarPercentage.value < 100) {
    loadingBarPercentage.value += 10;
    await delay(60);
  }
  await delay(500);
  showDinersaur.value = false;
}

function openModal () {
  showModal.value = true;
}

function closeModal () {
  showModal.value = false;
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

<template>
  <ion-page>
    <Header />

    <ion-content :fullscreen="true">
      <div class="account">

        <div class="name" v-if="userStore().restaurant">
          <h2 class="sequel">{{ userStore().restaurant?.name }}</h2>
          <StarRating :rating="userStore().restaurant?.rating.averageRating"/>
          
        </div>

        <div class="divider"></div>

        <ion-list inset lines="none" class="menu">
          <ion-nav-link v-for="page in pages" router-direction="forward" :component="page.component">
            <ion-item button class="menuButton">
              <ion-icon size="medium" aria-hidden="true" :icon="page.img" slot="start"></ion-icon>
              <div class="pageName">
                <h4>{{ page.name }}</h4>
                <p v-if="page.flavor">{{ page.flavor }}</p>
              </div>
            </ion-item>
          </ion-nav-link>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonIcon, IonAvatar, IonNavLink, IonNav, IonList } from '@ionic/vue';
import { add, medkit, language, card, key, create, map, settingsOutline, languageOutline, informationCircleOutline, cardOutline, cafeOutline, calendarOutline, happyOutline, medkitOutline, ribbonOutline, sadOutline, peopleOutline } from 'ionicons/icons';
import { defineComponent, ref, onMounted, computed, markRaw } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import StarRating from '@/components/StarRating.vue';
import { Page, userStore } from '@/stores/userStore';

import AccountSettingsView from '../RestaurantHome/RestaurantAccountFiles/AccountSettings.vue';
import BillingView from '../RestaurantHome/RestaurantAccountFiles/Billing.vue';
import LanguageView from '../RestaurantHome/RestaurantAccountFiles/Language.vue';
import AboutView from './RestaurantAccountFiles/AboutView.vue';
import ReviewsView from './RestaurantAccountFiles/ReviewsView.vue';
import ReservationView from './RestaurantAccountFiles/ReservationView.vue';
import DinersaurPartnershipView from './RestaurantAccountFiles/DinersaurPartnershipView.vue';
import Header from '@/components/Header.vue';

import version from '@/utils/version';

onMounted(() => {
  userName.value = userStore().name;
  image.value = userStore().profileImage;
});

// Change Profile Picture 

const image = ref<string | null>();

// Name
const userName = ref('');

const pages = ref<Page[]> ([{
  name: "Parternship",
  component: markRaw(DinersaurPartnershipView),
  img: peopleOutline,
  flavor: "View your partnership with Dinersaur"
}, {
  name: "Reservations",
  component: markRaw(ReservationView),
  img: calendarOutline,
  flavor: "View all of your reservations"
}, {
  name: "Reviews",
  component: markRaw(ReviewsView),
  img: userStore().rating.averageRating < 2.5 ? sadOutline : happyOutline
}, {
  name: "Billing",
  component: markRaw(BillingView),
  img: cardOutline
}, {
  name: "Manage Account",
  component: markRaw(AccountSettingsView),
  img: settingsOutline
}, {
  name: "Language",
  component: markRaw(LanguageView),
  img: languageOutline
}, {
  name: "About",
  component: markRaw(AboutView),
  img: informationCircleOutline,
  flavor: `v${version}`
}]);

</script>

<style lang="scss" scoped>

.account {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 92.5%;
  margin-top: 1em;

  h2 {
    margin: 0;
  }
}

.divider {
  width: 92.5%;
  height: 0.35em;
  border-radius: 1em;
  background-color: var(--ion-color-light-shade);
  margin-top: 0.75em;
}

ion-list.menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75em;

  ion-item.menuButton {
    width: 100%;

    ion-icon {
      margin-right: 0.5em;
      color: black;
    }

    .pageName {
      h4 {
        font-weight: 700;
      }

      h4, p {
        margin: 0;
      }
    }
  }
}

.version {
  display: flex;
  width: 100%;
  align-items: flex-start;
}
</style>
<template>
  <ion-page>
    <Header />

    <ion-content :fullscreen="true">
      <div class="account">

        <div class="name">
          <h2 class="sequel">{{ userStore().name }}</h2>
          <StarRating :rating="userStore().rating"/>
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

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonNavLink, IonLabel, IonItem, 
  onIonViewWillEnter} from '@ionic/vue';
import { add, medkit, language, card, key, medkitOutline, languageOutline, cardOutline, keyOutline, cafeOutline, ribbonOutline, informationCircleOutline, calendarOutline, settingsOutline, idCardOutline, happyOutline, sadOutline } from 'ionicons/icons';
import { defineComponent, ref, onMounted, Component, markRaw } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import StarRating from '../components/StarRating.vue';
import { userStore } from '@/stores/userStore';
import Header from '@/components/Header.vue';

import AccountSettingsView from './AccountViewFiles/AccountSettingsView.vue';
import AllergiesView from './AccountViewFiles/AllergiesView.vue';
import BillingView from './AccountViewFiles/BillingView.vue';
import LanguageView from './AccountViewFiles/LanguageView.vue';
import router from '@/router';
import SubscriptionView from './AccountViewFiles/SubscriptionView.vue';
import PointsView from './AccountViewFiles/PointsView.vue';
import AboutView from './AccountViewFiles/AboutView.vue';
import ReservationsView from './AccountViewFiles/ReservationsView.vue';
import version from '@/utils/version';

type Page = {
  name: string;
  flavor?: string;
  component: any;
  img: string;
}

const pages = ref<Page[]> ([{
  name: "Allergies",
  component: markRaw(AllergiesView),
  img: medkitOutline
}, {
  name: userStore().subscription.currentlySubscribed ? "Manage Subscription" : "Discover Steakosaurus",
  component: markRaw(SubscriptionView),
  img: cafeOutline,
  flavor: userStore().subscription.currentlySubscribed ? "Manage Steakosaurus subscription" : "+50% points, free drinks, and more"
}, {
  name: "Points",
  component: markRaw(PointsView),
  img: ribbonOutline,
  flavor: "Spend your reward points"
}, {
  name: "Reservations",
  component: markRaw(ReservationsView),
  img: calendarOutline,
  flavor: "View all of your reservations"
}, {
  name: "Reviews",
  component: markRaw(ReservationsView),
  img: userStore().rating < 2.5 ? sadOutline : happyOutline
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
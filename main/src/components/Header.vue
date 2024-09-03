<template>
    <ion-header>
        <ion-toolbar class="title">
          <div class="logo">
            <ion-img v-if="!userStore().subscription.currentlySubscribed || type == 'restaurant'" src="/icons/dinersaurWithShadow.svg"></ion-img>
            <ion-img v-else src="/icons/steakosaurusRight.svg"></ion-img>
            <h1 v-if="!userStore().subscription.currentlySubscribed || type == 'restaurant'" class="dinersaurText sequel">Dinersaur</h1>
            <h1 v-else class="dinersaurText subscribed sequel">Steakosaur</h1>
          </div>
        </ion-toolbar>
        <ion-toolbar>
          <div class="statusBar" v-if="!type">
            <button class="notifications" @click="openNotifications = !openNotifications">
              <ion-icon :icon="userStore().notifications.filter((notif) => !notif.read).length == 0 ? notificationsOutline : notifications"></ion-icon>
              <ion-badge v-if="userStore().notifications.filter((notif) => !notif.read).length != 0" slot="end">{{ userStore().notifications.filter((notif) => !notif.read).length }}</ion-badge>
            </button>
          </div>
          <div v-else></div>
        </ion-toolbar>
    </ion-header>

    <ion-modal :is-open="openNotifications" :initial-breakpoint="0.9" :breakpoints="[0, 0.65, 0.9, 1]" @didDismiss="closeNotifications">
      <ion-content>
        <h1>Notifications</h1>
        <ion-list>
          <ion-card class="notification" :class="{ new: notification.read }" v-for="notification in userStore().notifications">
            <h3><ion-badge v-if="!notification.read" slot="start">New</ion-badge>{{ notification.title }}</h3>
            <ion-card-subtitle>{{ timeSince(notification.date) }}</ion-card-subtitle>
            <p><span v-for="text in notification.text.split('\\n')">{{ text }}</span></p>
            <ion-button @click="dismissNotification(notification)" fill="clear">Dismiss</ion-button>
          </ion-card>
          <h3 v-if="userStore().notifications.length == 0">No new notifications! Check back later.</h3>
        </ion-list>
      </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">

import { ref, onMounted, watch, defineEmits } from 'vue';
import { IonHeader, IonToolbar, IonTitle, IonSearchbar, IonImg, IonIcon, IonBadge, IonContent, IonModal, IonLabel, IonButtons, IonButton, IonList, IonCard, IonCardSubtitle } from '@ionic/vue';
import { notifications, notificationsOutline } from 'ionicons/icons';
import { Notification, userStore } from '@/stores/userStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { timeSince } from '@/utils/functions';

type Props = {
  type?: "restaurant";
}

const props = defineProps<Props> ();

const openNotifications = ref(false);

async function closeNotifications () {
  openNotifications.value = false;
  for (let notification of userStore().notifications) {
    notification.read = true;
  }

  await updateDoc(doc(db, "users", userStore().userData?.uid ?? ""), { notifications: userStore().notifications });
}

async function dismissNotification (notification: Notification) {
  const index = userStore().notifications.indexOf(notification);
  userStore().notifications.splice(index, 1);
  await updateDoc(doc(db, "users", userStore().userData?.uid ?? ""), { notifications: userStore().notifications });
}

/* const searchResults = ref<any[]>([]);
let autocompleteService: google.maps.places.AutocompleteService;
let placesService: google.maps.places.PlacesService;

const emit = defineEmits(['updateSearchResults']);

async function handleInput(event: any) {
  const query = event.target.value;
  if (query.length > 0){
    const results = await getAutocompleteResults(query);
    searchResults.value = results;
    emit('updateSearchResults', results);
  }
}

const getAutocompleteResults = (query: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        if (!autocompleteService) {
            autocompleteService = new google.maps.places.AutocompleteService();
        }
        autocompleteService.getPlacePredictions({ input: query }, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
               resolve(predictions || []);
            } else {
                resolve([]);
            }
        });
    });
}; */

</script>

<style lang="scss" scoped>

ion-header {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
  width: 100vw;
  background-color: var(--ion-color-light);
  border: 0;
  border: 2px solid var(--ion-color-light-shade);
  border-left: 0;
  border-right: 0;
  border-top: 0;
}

ion-header.enabledHeader {
  justify-content: space-between;
}

ion-toolbar {
  height: 5.5em;
}

.title {
  width: fit-content;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding-right: 1em;

  ion-img {
    width: 5em;
    height: 5em;
  }

  h1 {
    margin: 0;
  }
}

ion-title.dinersaurText {
  width: 100%;
  transition: all 0.15s;
}

ion-title.subscribed {
  --color: var(--ion-color-primary-shade);
}

ion-title.disabled {
  width: 0px;
}

.statusBar {
  width: 100%;
  height: 5.5em;
  padding-right: 1em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.notifications {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  background-color: transparent;

  ion-icon {
    width: 2.5em;
    height: 2.5em;
  }
}

ion-card.notification {
  h3 {
    display: flex;
    gap: 0.25em;
    align-items: center;
    justify-content: flex-start;
    color: black;
  }

  ion-card-subtitle {
    color: black;
  }

  p {
    display: flex;
    flex-direction: column;
    color: black;
  }
}

ion-card.new {
  --background: var(--ion-color-light-shade);
}

</style>
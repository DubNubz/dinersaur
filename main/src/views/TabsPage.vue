<template>
  <ion-page>

    <ion-tabs>

      <ion-router-outlet></ion-router-outlet>

      <ion-fab v-if="router.currentRoute.value.path === '/pages/discover'" vertical="bottom" horizontal="center" slot="fixed" style="margin-bottom: 1em;">
        <ion-fab-button @click="openModal = true">
          <ion-icon :icon="videocamOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="openModal" :initial-breakpoint="1" :breakpoints="[0, 0.5, 0.8, 1]" @didDismiss="openModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ $t("create") }}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>

          <input ref="fileInput" type="file" accept="video/*"></input>
          <ion-input :label="$t('title')" placeholder="Untilted Video" counter :maxlength="100" v-model="title"></ion-input>
          <ion-button @click="createVideo">{{ $t("upload") }}</ion-button>

        </ion-content>
      </ion-modal>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/pages/home">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/pages/map">
          <ion-icon aria-hidden="true" :icon="mapOutline" />
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/pages/discover">
          <ion-icon aria-hidden="true" :icon="compassOutline" />
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/pages/account">
          <ion-icon aria-hidden="true" :icon="personCircleOutline" />
        </ion-tab-button>
      </ion-tab-bar>

    </ion-tabs>

  </ion-page>
</template>

<script setup lang="ts">

import router from '@/router';
import { userStore } from '@/stores/userStore';
import { db } from '@/utils/firebase';
import { getRandomItemFromArray } from '@/utils/functions';
import { IonPage, IonHeader, IonFab, IonFabButton, IonIcon, IonToolbar, IonTitle, IonContent, onIonViewDidLeave, onIonViewDidEnter, IonButton,
  IonButtons, IonModal, IonToast, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, 
  InfiniteScrollCustomEvent, IonAvatar, IonInput, onIonViewWillEnter, createAnimation, IonRippleEffect, IonCheckbox, IonTabBar, IonTabButton, IonRouterOutlet, IonTabs } from '@ionic/vue';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref as firebaseRef, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { homeOutline, compassOutline, personCircleOutline, mapOutline, bookmarks, addCircle, addCircleOutline, add, videocamOutline, videocamOffOutline } from 'ionicons/icons';
import { ref } from 'vue';

const fileInput = ref();

const openModal = ref(false);
const title = ref("");

async function createVideo () {
  const base64Characters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
    'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '-', '_'];
    
  let videoID = "";
  for (let i = 0; i < 12; i++) {
    videoID += getRandomItemFromArray(base64Characters);
  }
    
  const storage = getStorage();
  const file = fileInput.value.files[0];
  const video = firebaseRef(storage, "videos/" + videoID);

  try {
    const user = userStore().userData;
    if (!user) throw Error;

    const uploadTask = uploadBytesResumable(video, file);
    uploadTask.on('state_changed', () => {}, () => {}, async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log(downloadURL)
    
      await setDoc(doc(db, "videos", videoID), {
        id: videoID,
        title: title.value == "" ? "Untitled Video" : title.value,
        author: user.uid,
        views: 0,
        likes: 0,
        comments: [],
        url: downloadURL,
        created: new Date()
      });
    })
  } catch (error) {
    console.error(error)
  }
}

</script>

<style lang="scss" scoped>



</style>

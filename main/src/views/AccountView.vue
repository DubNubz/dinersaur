<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Account Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ExploreContainer name="Tab 3 page" />
      <div>
        <ion-item class="profile">
          <ion-label class="profile-label">Profile</ion-label>

          <ion-avatar class="avatar">
            <img v-if="image" :src="image" class="avatarimage"/>
          </ion-avatar>

          <ion-fab class="changeAvatar">
            <ion-fab-button @clicked="changeProfile">
              <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
          </ion-fab>
            
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonAvatar } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { defineComponent, ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const image = ref<string | undefined>();
image.value = "https://ionicframework.com/docs/img/demos/avatar.svg";

async function changeProfile() {
  const profilePic = await Camera.getPhoto( {
      quality: 90,
      source: CameraSource.Photos, 
      resultType: CameraResultType.Uri 
    } 
  )
  image.value = profilePic.webPath;
}

</script>

<style>
  .profile-label {
    padding-bottom: 400px;
  }
  .profile {
    margin-bottom: 100px;
    align-items: center;
    justify-content: center;
  }
  .changeAvatar{
    position: absolute;
    left: 50%;
    top: 200px;
    transform: translateX(-50%);
  }
  .avatar{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    transform: scale(3);
  }
</style>
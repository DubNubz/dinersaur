<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Account Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ExploreContainer name="Tab 3 page" />
      <div class="divOne">
        <ion-label class="profile-label">PRoFile</ion-label>
      </div>
      <div class="divTwo">
        <div class="avatarContainer">
          <ion-avatar class="avatar">
            <img v-if="image" :src="image" class="avatarimage"/>
          </ion-avatar>
          <ion-button class="avatarButton" @clicked="changeProfile">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </div>
      </div>
      <div class="divThree">
        <IonLabel>Name:<br>{{ userName }}</IonLabel>
      </div>
      <div class="divFour">
        <StarRating :rating="3.8"/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonIcon, IonAvatar } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { defineComponent, ref, onMounted } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import StarRating from '../components/StarRating.vue';

// Change Profile Picture

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

// Name
const userName = ref('');

onMounted(() => {
  userName.value = localStorage.getItem('userName') || '';
});

</script>

<style>
  .divOne{
    display: flex;
    align-items: flex-start;
    justify-content: left;
  }
  .divTwo{
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 30%;
  }
  .profile-label{
    padding-top: 10px;
    padding-left: 10px;
    align-items: flex-start;
  }
  .avatarContainer{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar {
    position: absolute;
    width: 200px;
    height: 200px;
    z-index: 1;
  }
  .avatarButton{
    position: absolute;
    padding-top: 45%;
    z-index: 2;
  }
  .divThree{
    padding-top: 20px;
    padding-left: 10px;
    
  }

</style>
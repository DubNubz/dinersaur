<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Account Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="divOne">
        <ion-label class="profile-label">Profile</ion-label>
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
        <StarRating :rating="3.6"/>
      </div>
      <div class="divFour"></div>
      <div class="divFive">
        <ion-label>Preferences</ion-label>
      </div>
      <div class="divSix">
        <ion-nav-link router-direction="forward" :component="AllergiesView">
          <ion-button class="allergyButton">
            <ion-label >Allergies</ion-label>
            <ion-icon :icon="medkit" color="secondary"></ion-icon>
          </ion-button>
        </ion-nav-link>

        <ion-nav-link router-direction="forward" :component="BillingView">
          <ion-button class="billingButton">
            <ion-label >Billing</ion-label>
            <ion-icon :icon="card" color="secondary"></ion-icon>
          </ion-button>
        </ion-nav-link>
        
        <ion-nav-link router-direction="forward" :component="LanguageView">
          <ion-button class="languageButton">
            <ion-label>Language</ion-label>
            <ion-icon :icon="language" color="secondary"></ion-icon>
          </ion-button>
        </ion-nav-link>

        <ion-nav-link router-direction="forward" :component="AccountSettingsView">
          <ion-button class="accountButton">
            <ion-label>Account</ion-label>
            <ion-icon :icon="key" color="secondary"></ion-icon>
          </ion-button>
        </ion-nav-link>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonIcon, IonAvatar, IonNavLink, IonNav } from '@ionic/vue';
import { add, medkit, language, card, key } from 'ionicons/icons';
import { defineComponent, ref, onMounted } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import StarRating from '../components/StarRating.vue';

import AccountSettingsView from './AccountViewFiles/AccountSettingsView.vue';
import AllergiesView from './AccountViewFiles/AllergiesView.vue';
import BillingView from './AccountViewFiles/BillingView.vue';
import LanguageView from './AccountViewFiles/LanguageView.vue';

onMounted(() => {
  userName.value = localStorage.getItem('userName') ?? "";
});

// Change Profile Picture

const image = ref("https://ionicframework.com/docs/img/demos/avatar.svg");

async function changeProfile() {
  const profilePic = await Camera.getPhoto( {
      quality: 90,
      source: CameraSource.Photos, 
      resultType: CameraResultType.Uri 
    } 
  )
  image.value = profilePic.webPath ?? "";
}

// Name
const userName = ref('');

</script>

<style lang="scss" scoped>

.divOne {
  display: flex;
  align-items: flex-start;
  justify-content: left;
}

.divTwo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 30%;
}

.profile-label {
  padding-top: 10px;
  padding-left: 10px;
  align-items: flex-start;
}

.avatarContainer {
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

.avatarButton {
  position: absolute;
  padding-top: 45%;
  z-index: 2;
}

.divThree {
  padding-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.divFour {
  width: 95vw;
  height: 1px;
  margin: 10px;
  background-color: black;
}

.divFive {
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
}

.divSix {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.accountButton,
.billingButton,
.languageButton,
.allergyButton {
  flex: 1 1 40%;
  margin: 5px;
  width: 45vw;
  min-width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;

  ion-label{
    padding-right: 5px;
  }
  
  ion-icon{
    padding-left: 5px;
  }
}
</style>
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/pages/account"></ion-back-button>
        </ion-buttons>
        <ion-title>Account Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <div class="settings-container">
        <ion-list>
          <ion-item>
            <ion-label>Username</ion-label>
            <ion-input v-model="username" placeholder="Enter your username"></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label>Email</ion-label>
            <ion-input v-model="email" type="email" placeholder="Enter your email"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label>Password</ion-label>
            <ion-input v-model="password" type="password" placeholder="Enter your password"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label>Phone Number</ion-label>
            <ion-input v-model="phoneNumber" type="tel" placeholder="Enter your phone number"></ion-input>
          </ion-item>
        </ion-list>

        <ion-button expand="block" @click="saveSettings" color="primary">Save Changes</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';

const username = ref('');
const email = ref('');
const password = ref('');
const phoneNumber = ref('');

function saveSettings() {
  // Logic to save settings goes here
  console.log('Settings saved:', { username: username.value, email: email.value, password: password.value, phoneNumber: phoneNumber.value });
}

</script>

<style lang="scss" scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f7f7f7;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

ion-item {
  --background: #ffffff;
  border-radius: 5px;
}

ion-label {
  color: #4a4a4a;
  font-weight: 600;
}

ion-input {
  --padding-start: 10px;
}

ion-button {
  margin-top: 20px;
  border-radius: 20px;
}
</style>

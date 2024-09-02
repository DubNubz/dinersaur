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
          <h2>Personal Information</h2>
          <ion-item>
            <ion-label>Username</ion-label>
            <ion-input v-model="username" placeholder="Enter your username"></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label>Email</ion-label>
            <ion-input v-model="email" type="email" placeholder="Enter your email"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label>Phone Number</ion-label>
            <ion-input v-model="phoneNumber" type="tel" placeholder="Enter your phone number"></ion-input>
          </ion-item>

          <ion-button expand="block" @click="saveSettings" color="primary">Save Changes</ion-button>
        </ion-list>

        <ion-list>
          <div class="security">
            <h2>Security</h2>
            <ion-icon :icon="shield"></ion-icon>
          </div>

          <ion-item>
            <ion-label>Password</ion-label>
            <ion-input v-model="password" type="password" placeholder="Enter new password"></ion-input>
          </ion-item>
        </ion-list>

        <ion-button expand="block" @click="savePassword" color="primary">Save Changes</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/vue';
import { userStore } from '@/stores/userStore';
import { getAuth, updatePassword, updateEmail } from 'firebase/auth';
import { shield } from 'ionicons/icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const username = ref(userStore().name);
const email = ref(getAuth().currentUser?.email as string);
const password = ref('');
const phoneNumber = ref(userStore().billing.phoneNumber);

async function saveSettings() {
  const store = userStore();
  if (!store) return;

  store.name = username.value;
  store.billing.phoneNumber = phoneNumber.value;
  
  const auth = getAuth();
  if (auth.currentUser) await updateEmail(auth.currentUser, email.value);
  if (store.userData) await updateDoc(doc(db, "users", store.userData.uid), { name: username.value, billing: { phoneNumber: phoneNumber.value }});
}

async function savePassword() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user && password.value) {
    try {
      await updatePassword(user, password.value);
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  }
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

.security {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  h2 {
    margin: 0px;
  }
}

</style>

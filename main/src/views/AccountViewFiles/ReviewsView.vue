<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/pages/account"></ion-back-button>
        </ion-buttons>
        <ion-title>User Reviews</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h1>Recent Reviews</h1>
      <ion-list>
        <ion-item v-for="review in reviews" :key="review.id">
          <ion-label>
            <h2>{{ review.rating }} ★ - {{ review.date }}</h2>
            <p>{{ review.text }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/vue';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const reviews = ref([]); 

onMounted(async () => {
  const q = query(
    collection(db, 'users'),
    where('userId', '==', 'userId'),
    orderBy('date', 'desc') 
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    reviews.value.push({ id: doc.id, ...doc.data() });
  });
});
</script>

  
<style lang="scss" scoped>
ion-item {
  --background: #f7f7f7;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

ion-label h2 {
  color: #4a4a4a;
  font-weight: bold;
  margin-bottom: 5px;
}

ion-label p {
  color: #6b6b6b;
  font-size: 14px;
}
</style>

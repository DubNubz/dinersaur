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
        <ion-item v-for="review in sortedReviews" :key="review.id">
          <ion-label>
            <h2><StarRating :rating="review.rating"/> - {{ formatTime(review.date) }}</h2>
            <p>{{ review.description }}</p>
            <p>{{ getName(review.id) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/vue';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { PersonalizedRatings, RestaurantInfo, userStore } from '@/stores/userStore';
import StarRating from '@/components/StarRating.vue';
import { formatTime } from '@/utils/functions';

// Store the user's reviews here
const reviews = ref<PersonalizedRatings[]>([]);

onMounted(async () => {
  const q = await getDoc(doc(db, "users", userStore().userData?.uid ?? ""));

  if (q) { 
    const userReviews = q.data()?.rating.ratings;
    if (userReviews) {
      reviews.value.push(...userReviews);
    }
  }
});

const sortedReviews = computed(() =>
  reviews.value.sort((a, b) => b.date - a.date)
);

async function getName(id: string) {
    const q = await getDoc(doc(db, "restaurants", id));
    const data = q.data() as RestaurantInfo;
    return data.name;
}
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

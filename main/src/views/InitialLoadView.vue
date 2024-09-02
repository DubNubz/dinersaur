<template>
    <ion-page>
        <ion-content class="ion-padding">
            <DinersaurLoad :barPercent="loadingBarPercentage" :destination="'/chooseAccount'" />
        </ion-content>
    </ion-page>
</template>
  
<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonImg, onIonViewDidEnter } from '@ionic/vue';
import { delay, getRestaurants, getVideo } from '@/utils/functions';
import router from '@/router';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { RestaurantInfo, userStore } from '@/stores/userStore';
import { db } from '@/utils/firebase';
import DinersaurLoad from '@/components/DinersaurLoad.vue';

const loadingBarPercentage = ref(10);

onIonViewDidEnter(async () => {
    /* load data from firebase into userStore.ts */
    try {
        userStore().currentVideo = await getVideo();
        loadingBarPercentage.value += 10;
    
        for (let i = 0; i < 5; i++) {
            userStore().videoQueue.push(await getVideo());
            loadingBarPercentage.value += 10;
        }

        // todo: only get restaurants from within X miles of the user
        userStore().nearbyRestaurants = await getRestaurants() as RestaurantInfo[];

    } catch (error) {
        console.error(error);
    }

    /* when done loading data, set loading bar to 100 */
    if (!userStore().userData) loadingBarPercentage.value = 100;
    else {
        console.log(userStore().restaurant)
        if (userStore().restaurant) router.push("/restaurant/home");
        else router.push("/pages/home");
    }
});

</script>

<style lang="scss" scoped>

</style>
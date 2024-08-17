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
import { delay, getVideo } from '@/utils/functions';
import router from '@/router';
import { doc, getDoc } from 'firebase/firestore';
import { userStore } from '@/stores/userStore';
import { db } from '@/utils/firebase';
import DinersaurLoad from '@/components/DinersaurLoad.vue';

const loadingBarPercentage = ref(10);

onIonViewDidEnter(async () => {
    /* load data from firebase into userStore.ts */
    userStore().currentVideo = await getVideo();
    loadingBarPercentage.value += 10;

    for (let i = 0; i < 5; i++) {
        userStore().videoQueue.push(await getVideo());
        loadingBarPercentage.value += 10;
    }
    
    // check if user is logged in locally

    /* when done loading data, set loading bar to 100 */
    if (!userStore().userData) loadingBarPercentage.value = 100;
    else router.push("/pages/home");
});

</script>

<style lang="scss" scoped>

</style>
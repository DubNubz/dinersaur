<template>
    <ion-page>
        <ion-content class="ion-padding">
            <div class="content">
                <ion-img src="/icons/dinersaurWithShadow.svg"></ion-img>
                <h1 class="sequel">Dinersaur</h1>
                <div class="loadingBar">
                    <div class="filler" :style="{ width: `${loadingBarPercentage - (10 * loadingBarPercentage * 0.01)}vw` }"></div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>
  
<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonImg, onIonViewDidEnter } from '@ionic/vue';
import { delay } from '@/utils/functions';
import router from '@/router';
import { doc, getDoc } from 'firebase/firestore';
import { userStore } from '@/stores/userStore';
import { db } from '@/utils/firebase';

const loadingBarPercentage = ref(0);

watch(() => loadingBarPercentage.value, async () => {
    if (loadingBarPercentage.value >= 100) {
        await delay(500);
        router.push("/chooseAccount");
    }
});

onIonViewDidEnter(async () => {
    const store = userStore();
    const user = store.userData;
    console.log(user)

    if (user) {
        try {
            const docData = await getDoc(doc(db, "users", user.uid));
            const userData = docData.data();
            if (!userData) return;

            store.currentAllergies = userData.allergies;
            store.billing = userData.billing;
            store.reservations = userData.currentReservations;
            store.language = userData.language;
            store.name = userData.name;
            store.pastReservations = userData.pastReservations;
            store.rating = userData.rating;
            store.smProfile = userData.smProfile;
            console.log(store)

        } catch (error) {
            console.error(error);
        }
    }


    /* load data from firebase into userStore.ts */

    // can be deleted
    while (loadingBarPercentage.value < 100) {
        loadingBarPercentage.value += 10;
        await delay(100);
    }

    /* when done loading data, set loading bar to 100 */
});

</script>

<style lang="scss" scoped>

.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;

    h1 {
        font-size: 3em;
    }

    .loadingBar {
        width: 90vw;
        height: 40px;
        background-color: var(--ion-color-dark);
        border-radius: 50px;

        .filler {
            height: 40px;
            border-radius: 50px;
            background-color: var(--ion-color-secondary);
            transition: all 0.5s;
        }
    }
}

</style>
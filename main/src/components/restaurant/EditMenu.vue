<template>
    <div class="component" v-if="restaurant">
        <h1>Current Menu</h1>
        <div class="menu" v-if="restaurant.menu.length != 0">
            <div class="category" v-for="category in [...new Set(restaurant.menu.map((item) => item.category))]">
                <h4>{{ category }}</h4>
                <div class="item" v-for="item in restaurant.menu.filter((item) => item.category == category)">
                    <p>{{ item.name }}</p>
                </div>
            </div>
        </div>
        <p v-else>Nothing here yet. Try adding a menu item!</p>
        <ion-button @click="editMenu">Edit Menu</ion-button>
    </div>
</template>

<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar,
  onIonViewWillEnter} from '@ionic/vue';
import { RestaurantInfo, userStore } from '@/stores/userStore';
import { ref, watch, onMounted } from 'vue';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const restaurant = ref<RestaurantInfo> ();

onMounted(() => {
    restaurant.value = userStore().restaurant;
});

async function editMenu () {
    try {
        /*const docData = await getDoc(doc(db, "restaurants", userStore().userData?.uid ?? ""));
        const restaurantData = docData.data();*/

        await updateDoc(doc(db, "restaurants", userStore().userData?.uid ?? ""), { menu: [{
            id: "38095809235",
            name: "Small Mac",
            category: "Appetizers",
            description: "Big Mac but small",
            price: 420.69,
            nutritionalInfo: {
                calories: 420,
                saturatedFat: 69,
                transFat: 6.9,
                cholesterol: 42,
                sodium: 4.2,
                protein: 0
            }
        }] });

    } catch (error) {
        console.error(error);
    }
}
 
</script>

<style lang="scss" scoped>

.component {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

</style>
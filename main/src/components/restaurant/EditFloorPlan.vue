<template>
    <div class="component" v-if="restaurant">
        <h1>Floor Plan</h1>
        <div class="floorPlan">
            <div v-for="floorObject in restaurant.layout">
                <div v-for="floorArray in floorObject">
                    <div class="floor" v-for="rowObject in floorArray">
                        <div class="row" v-for="rowArray in rowObject">
                            <div class="cellBackground" v-for="cell in rowArray">
                                <div class="cell" :class="{ void: cell == -1, empty: cell == 0, chair: cell == 1, table: cell == 2, door: cell == 3, bathroom: cell == 4 }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ion-button @click="editFloor">Edit Floor</ion-button>
    </div>
</template>

<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar,
  onIonViewWillEnter} from '@ionic/vue';
import { RestaurantInfo, userStore } from '@/stores/userStore';
import { ref, watch, onMounted } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const restaurant = ref<RestaurantInfo> ();

onMounted(() => {
    restaurant.value = userStore().restaurant;
});

async function editFloor () {
    try {
        /*const docData = await getDoc(doc(db, "restaurants", userStore().userData?.uid ?? ""));
        const restaurantData = docData.data();*/

        await updateDoc(doc(db, "restaurants", userStore().userData?.uid ?? ""), {
            layout: [{
                0: [{
                    0: [0, 1, 0, 0, 0, 1, 0, 0],
                    1: [1, 2, 1, 0, 1, 2, 1, 0],
                    2: [0, 1, 0, 0, 0, 1, 0, 0],
                    3: [4, 0, -1, -1, -1, 0, 0, 3],
                    4: [4, 0, -1, -1, -1, 0, 0, 3],
                    5: [0, 0, 0, 0, 0, 0, 0, 0],
                    6: [0, 0, 0, 0, 0, 0, 0, 0],
                    7: [1, 2, 1, 0, 1, 2, 1, 0]
                }]
            }]
            /*layout: [
                [
                    [0, 1, 0, 0, 0, 1, 0],
                    [1, 2, 1, 0, 1, 2, 1],
                    [0, 1, 0, 0, 0, 1, 0],
                    [0, 0, -1, -1, -1, 0, 0, 0, 3],
                    [0, 0, -1, -1, -1, 0, 0, 0, 3],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [1, 2, 1, 0, 1, 2, 1]
                ]
            ]*/
        });

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

.floorPlan {
    display: flex;
    align-items: center;
    justify-content: center;
}

@keyframes background-pan {
    from {
        background-position: 0% center;
    }

    to {
        background-position: 200% center;
    }
}

.floor {
    animation: background-pan 2.5s linear infinite;
    background: linear-gradient(to right, var(--ion-color-primary-shade), var(--ion-color-secondary-shade), var(--ion-color-primary-shade));
    background-size: 200%;
}

.row {
    display: flex;
    align-items: center;
    justify-content: center;
}

.cellBackground {
    padding: 1.5px;
}

.cell {
    width: 2em;
    height: 2em;
}

.void {
    background-color: black;
}
.empty {
    background-color: var(--ion-color-light-shade);
}
.chair {
    background-color: green;
}
.table {
    background-color: blue;
}
.door {
    background-color: red;
}
.bathroom {
    background-color: pink;
}

</style>
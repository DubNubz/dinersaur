<template>
    <ion-page id="main-content">
        <Header :type="'restaurant'" />
        <ion-content>
            <div class="page">
                <div class="buttons">
                    <div class="cardBackground" v-for="card in cards" @click="card.variable.value = true">
                        <div class="card">
                            <ion-icon :icon="card.icon"></ion-icon>
                            <h1>{{ card.title }}</h1>
                            <p>{{ card.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>

        <ion-modal v-for="card in cards" :is-open="card.variable.value" @didDismiss="card.variable.value = false">
            <ion-header>
                <ion-toolbar>
                    <ion-title>{{ card.title }}</ion-title>
                    <ion-buttons slot="end">
                        <ion-button @click="card.variable.value = false">Done</ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>

            <ion-content>
                <component :is="card.component" />
            </ion-content>
        </ion-modal>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar,
  onIonViewWillEnter} from '@ionic/vue';
import { apps, arrowForwardOutline, barChart, book, create, flag, pencil, pricetags, restaurant, settings } from 'ionicons/icons';
import { ref, computed, onMounted, markRaw } from 'vue';
import RestaurantLayout from '@/components/RestaurantLayout.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import { userStore } from '@/stores/userStore';
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';
import { delay } from '@/utils/functions';
import EditMenu from '@/components/restaurant/EditMenu.vue';
import EditFloorPlan from '@/components/restaurant/EditFloorPlan.vue';
import EditReviews from '@/components/restaurant/EditReviews.vue';
import EditMarker from '@/components/restaurant/EditMarker.vue';
import EditPromotions from '@/components/restaurant/EditPromotions.vue';
import EditStatistics from '@/components/restaurant/EditStatistics.vue';
import RestaurantMapDesign from './RestaurantMapDesign.vue';

const router = useRouter();

const openMenuModal = ref(false);
const openFloorPlanModal = ref(false);
const openReviewsModal = ref(false);
const openMarkerModal = ref(false);
const openPromotionsModal = ref(false);
const openStatisticsModal = ref(false);

const cards = [{
    title: "Menu",
    description: "Edit your restaurant's menu",
    icon: restaurant,
    variable: openMenuModal,
    component: markRaw(EditMenu)
}, {
    title: "Floor Plan",
    description: "Edit your restaurant's floor plan",
    icon: apps,
    variable: openFloorPlanModal,
    component: markRaw(EditFloorPlan)
}, {
    title: "Reviews",
    description: "View and respond to your restaurant's reviews",
    icon: book,
    variable: openReviewsModal,
    component: markRaw(EditReviews)
}, {
    title: "Marker",
    description: "Edit your restaurant map marker's information",
    icon: flag,
    variable: openMarkerModal,
    component: markRaw(RestaurantMapDesign)
}, {
    title: "Promotions",
    description: "View your restaurant's ongoing promotions",
    icon: pricetags,
    variable: openPromotionsModal,
    component: markRaw(EditPromotions)
}, {
    title: "Statistics",
    description: "View your restaurant's statistics",
    icon: barChart,
    variable: openStatisticsModal,
    component: markRaw(EditStatistics)
}];

</script>

<style lang="scss" scoped>

.page {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
}

.buttons {
    display: flex;
    align-items: stretch;
    justify-content: center;
    align-content: stretch;
    flex-wrap: wrap;
    gap: 2.5%;
    height: 100%;
    padding-top: 2em;
    padding-bottom: 2em;
}

.cardBackground {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45%;
    padding: 1%;
    border-radius: 1.2em;
    background: linear-gradient(to top, var(--ion-color-primary), var(--ion-color-tertiary), var(--ion-color-primary));
}

.cardBackground:nth-child(-n+2) {
    background: linear-gradient(to top, var(--ion-color-primary), var(--ion-color-secondary));
}

.cardBackground:nth-last-child(-n+2) {
    background: linear-gradient(to bottom, var(--ion-color-primary), var(--ion-color-secondary));
}

.card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    width: 100%;
    height: 100%;
    padding: 1%;
    padding-left: 2.5%;
    padding-right: 2.5%;
    border-radius: 1em;
    background-color: rgba(255, 255, 255, 0.875);

    ion-icon {
        width: 4em;
        height: 4em;
    }

    h1, p {
        margin: 0;
    }
}

</style>


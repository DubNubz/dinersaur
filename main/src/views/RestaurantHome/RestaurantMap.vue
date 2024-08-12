<template>
    <ion-menu side="start" menu-id="first" content-id="main-content">
        <ion-header>
            <ion-toolbar>
                <ion-title>Floors</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-item 
                    v-for="(floor, index) in floors" 
                    :key="index" 
                    @click="selectFloor(index)" 
                    :class="{ selected: index === selectedFloorIndex }">
                    <ion-label>{{ floor.name }}</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-menu>

    <ion-page id="main-content">
        <ion-header class="config">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>Restaurant Layout</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="openIonModel">
                        <ion-icon :icon="settings"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <h1 class="text">Your Restaurant Layout</h1>
            <p class="text">Click on the grid and place the necessary furniture to create a 2D floor space of your restaurant. Use the settings icon to change the dimensions of the grid. A 3D model will be created using the 2D model. </p>
            <div class="switch">
                <p>View In 3D</p>
                <ToggleSwitch/>
            </div>
            <div class="divider"></div>
            <RestaurantLayout :length="selectedFloor.length" :width="selectedFloor.width" :selected-item="selectedItem" :selected-floor-index="selectedFloorIndex"/>
        </ion-content>

        <ion-modal :is-open="isModalOpen" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75]" @didDismiss="isModalOpen = false">
            <ion-header>
                <ion-toolbar>
                    <ion-title>Restaurant Settings</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content class="modalContent">
                <ion-list>
                    <ion-item>
                        <ion-label position="floating">Number of Floors</ion-label>
                        <ion-input class="input" type="number" v-model.number="numFloors"></ion-input>
                    </ion-item>
                    <ion-item-group v-for="(floor, index) in floors" :key="index">
                        <ion-item-divider>
                            <ion-label>{{ floor.name }}</ion-label>
                            <ion-button slot='end' @click="openEditAlert(index)">
                                <ion-icon :icon="pencil"></ion-icon>
                            </ion-button>
                        </ion-item-divider>
                        <ion-item>
                            <ion-label position="floating">Width</ion-label>
                            <ion-input class="input" type="number" v-model.number="floor.width"></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-label position="floating">Length</ion-label>
                            <ion-input class="input" type="number" v-model.number="floor.length"></ion-input>
                        </ion-item>
                    </ion-item-group>
                </ion-list>
                <div class="spacer"></div>
            </ion-content>
        </ion-modal>
        
        <ion-alert
            v-if="isAlertOpen"
            :is-open="isAlertOpen"
            header="Edit Floor Name"
            :inputs="alertInputs"
            :buttons="alertButtons"
            @didDismiss="isAlertOpen = false"
        ></ion-alert>

        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button>
                <ion-icon :icon="create"></ion-icon>
            </ion-fab-button>
            <ion-fab-list side="top">
                <ion-fab-button @click="selectedItem = 'Wall'"><img src="/icons/wallIcon.svg" alt="Wall"></ion-fab-button>
                <ion-fab-button @click="selectedItem = 'Table'"><img src="/icons/tableIcon.svg" alt="Table"></ion-fab-button>
                <ion-fab-button @click="selectedItem = 'Chair'"><img src="/icons/chairIcon.svg" alt="Chair"></ion-fab-button>
            </ion-fab-list>
        </ion-fab>
    </ion-page>
</template>

<script setup lang="ts">
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal, IonInput, IonItemGroup, IonItemDivider, IonAlert, IonPage, IonButtons, IonMenuButton, IonFab, IonFabList, IonFabButton } from '@ionic/vue';
import { create, pencil, settings } from 'ionicons/icons';
import { ref, computed } from 'vue';
import RestaurantLayout from '@/components/RestaurantLayout.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';

const selectedItem = ref<string>('');

const isModalOpen = ref(false);
const isAlertOpen = ref(false);
const numFloors = ref(1);
const alertInputs = ref([{ name: 'name', type: 'text', placeholder: 'Enter Floor Name' }]);
const currentEdit = ref(-1);
const selectedFloorIndex = ref(0);

const floors = computed(() => {
    return Array.from({ length: numFloors.value }, (_, index) => ({
        name: `Floor ${index + 1}`,
        width: 7,
        length: 7
    }));
});

const alertButtons = [
    { text: 'Cancel', role: 'cancel' }, 
    { text: 'OK', handler: handleAlertOk }
];

const selectedFloor = computed(() => {
    return floors.value[selectedFloorIndex.value];
});

function openIonModel() {
    isModalOpen.value = true;
}

function openEditAlert(index: number) {
    isAlertOpen.value = true;
    currentEdit.value = index;
}

function handleAlertOk(data: any) {
    if (currentEdit.value !== -1 && data.name) {
        floors.value[currentEdit.value].name = data.name;
        currentEdit.value = -1;
    }
}

function selectFloor(index: number) {
    selectedFloorIndex.value = index;
}
</script>

<style scoped>
.config {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.spacer {
    height: 15em;
}
.input {
    margin-top: 0.4em;
}
.modalContent {
    height: 100%;
    overflow-y: auto;
}
.selected {
    color: var(--ion-color-primary, #fff);
}
.text {
    margin: 15px;
    padding: 15px; 
    background-color: var(--ion-color-light);
    border: 2px solid var(--ion-color-primary);
    border-radius: 10px; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    color: var(--ion-color-dark); 
}

.divider {
  width: 95vw;
  height: 1px;
  margin: 10px;
  background-color: black;
}

.switch {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

</style>

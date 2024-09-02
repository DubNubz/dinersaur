<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/restaurant/account"></ion-back-button>
        </ion-buttons>
        <ion-title>Customize Map</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true">
            <ion-icon :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="map-container">
        <my-map
          :markerData="userStore().restaurantMarkerData"
          @onMarkerClicked="isModalOpen = true"
          :querySelect="undefined">
        </my-map>
      </div>

      <ion-modal :is-open="isModalOpen" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75, 1]" @didDismiss="isModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ userStore().restaurantName }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="allowEdit = true">Edit</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <!-- Image Carousel Section -->
          <div class="section">
            <h2>Image Carousel</h2>
            <ion-button @click="triggerFileInput">Upload Image</ion-button>
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;" />
            <div v-if="imageData">
              <img :src="imageData" alt="Selected Image" class="carousel-image" />
            </div>
          </div>  

          <!-- Divider -->
          <ion-item lines="full" class="divider"></ion-item>

          <!-- Reservation Times Section -->
          <div class="section">
            <h2>Reservation Times</h2>
            <ion-button @click="addDateTimeButton">
              <ion-icon :icon="add"></ion-icon>
            </ion-button>

            <div v-for="(button, index) in dateTimeButtons" :key="index" class="date-time-container">
              <ion-datetime-button :datetime="button"></ion-datetime-button>
              <ion-modal :keep-contents-mounted="true">
                <ion-datetime presentation="time" :id="button"></ion-datetime>
              </ion-modal>
            </div>
          </div>

          <!-- Divider -->
          <ion-item lines="full" class="divider"></ion-item>

          <!-- Description Section -->
          <div class="section">
            <h2>Description</h2>
            <ion-input v-model="description" placeholder="Enter a description for your restaurant!" class="description-input"></ion-input>
          </div>

          <!-- Divider -->
          <ion-item lines="full" class="divider"></ion-item>

          <!-- Opening & Closing Hours Section -->
          <div class="section">
            <h2>Opening & Closing Hours</h2>
            <ion-list>
              <ion-item v-for="(hour, index) in hours" :key="index" class="hours-item">
                <ion-label>{{ hour.day }}</ion-label>
                <ion-input
                  v-model="hour.open"
                  placeholder="Open Time"
                  type="time"
                ></ion-input>
                <ion-input
                  v-model="hour.close"
                  placeholder="Close Time"
                  type="time"
                ></ion-input>
              </ion-item>
            </ion-list>          
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonInput, IonItem, IonList, IonLabel } from '@ionic/vue';
import MyMap from '../HomeViewFiles/MyMap.vue';
import { userStore } from '@/stores/userStore';
import { ref } from 'vue';
import { add, settingsOutline } from 'ionicons/icons';

const isModalOpen = ref(false);
const allowEdit = ref(false);

const imageData = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const dateTimeButtons = ref<string[]>([]);

const description = ref('');

const hours = ref([
  { day: 'Monday', open: '09:00', close: '18:00' },
  { day: 'Tuesday', open: '09:00', close: '18:00' },
  { day: 'Wednesday', open: '09:00', close: '18:00' },
  { day: 'Thursday', open: '09:00', close: '18:00' },
  { day: 'Friday', open: '09:00', close: '18:00' },
  { day: 'Saturday', open: '10:00', close: '16:00' },
  { day: 'Sunday', open: 'Closed', close: 'Closed' },
]);

const triggerFileInput = (): void => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target) {
        imageData.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

function addDateTimeButton() {
  const id = `datetime-${dateTimeButtons.value.length + 1}`;
  dateTimeButtons.value.push(id);
}
</script>

<style lang="scss" scoped>
.map-container {
  width: 100vw;
  height: 100vh;
}

.section {
  padding: 16px;
  transition: all 0.3s ease;
  background-color: var(--ion-background-color);
  border-radius: 8px;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.2em;
  margin-bottom: 12px;
  color: var(--ion-text-color);
}

.carousel-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.carousel-image:hover {
  transform: scale(1.05);
}

.description-input {
  border: 1px solid var(--ion-color-medium);
  border-radius: 8px;
  padding: 8px;
  transition: box-shadow 0.3s ease;
}

.description-input:focus {
  box-shadow: 0 0 5px var(--ion-color-primary);
}

.date-time-container {
  margin-top: 10px;
}

.hours-item {
  transition: background-color 0.3s ease;
}

.hours-item:hover {
  background-color: var(--ion-color-primary);
}

.divider {
  margin: 20px 0;
  background-color: var(--ion-color-primary);
  height: 1px;
}
</style>


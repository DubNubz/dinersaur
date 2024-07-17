<template>
  <ion-page>
    <Header/>
    <ion-content>
      <div class="heading">
        <ion-text>{{ restaurantName }}'s Dashboard</ion-text>
      </div>
      <div class="dashboard">
        <ion-card class="metric-card" @click="openModal('Incoming Reservations')">
          <ion-card-header>
            <ion-card-title>Incoming Reservations</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ incomingReservationsCount }}</p>
          </ion-card-content>
        </ion-card>

        <ion-card class="metric-card" @click="openModal('Customers')">
          <ion-card-header>
            <ion-card-title>Customers</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ customersCount }}</p>
          </ion-card-content>
        </ion-card>
        
        <ion-card class="metric-card" @click="openModal('Reservations')">
          <ion-card-header>
            <ion-card-title>Reservations</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p> Total Reservations: {{ reservationsCount }}<br>Confirmed: {{ confirmedReservations }}</p>
          </ion-card-content>
        </ion-card>
        
        <ion-card class="metric-card" @click="openModal('Revenue')">
          <ion-card-header>
            <ion-card-title>Revenue</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>${{ revenue }}</p>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-modal :is-open="isModalOpen" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75]" @didDismiss="isModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ modalTitle }}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <!-- Modal content goes here -->
          <p v-if="modalType.localeCompare('customers', undefined, { sensitivity: 'accent' }) === 0">
            Details about customers...

          </p>
          <p v-if="modalType.localeCompare('revenue', undefined, { sensitivity: 'accent' }) === 0">
            <Line :data="lineChartData"/>
          </p>
          <p v-if="modalType.localeCompare('reservations', undefined, { sensitivity: 'accent' }) === 0">
            Details about incoming reservations...
            <ion-grid>
              <ion-row>
                <ion-col size="12" size-sm="6" size-md="4" v-for="(time, index) in reservationTimes" :key="index">
                  <ion-item>
                    <ion-label>{{ time }}</ion-label>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>
          </p>
          <p v-if="modalType.localeCompare('incoming reservations', undefined, { sensitivity: 'accent' }) === 0">
            <ion-card v-if="currentReservation">
              <ion-card-header> empty </ion-card-header>
              <ion-card-content>
                empty
              </ion-card-content>
            </ion-card>
            <ion-button expand="block" @click="next" :disabled="currentIndex >= currentReservations.length - 1">Next</ion-button>
            <ion-button expand="block" @click="back" :disabled="currentIndex == 0">Back</ion-button>
          </p>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IonPage, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/vue';
import Header from '@/components/Header.vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

const restaurantName = localStorage.getItem('restaurantName') ?? "";

const reservationTimes = ref(["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]);
const confirmedReservations = ref('');
const isModalOpen = ref(false);

const customersCount = ref(100);
const reservationsCount = ref(50);
const incomingReservationsCount = ref(20);
const revenue = ref(1500);

const modalTitle = ref("");
const modalType = ref("");

type Reservation = {
    title: string;
    content: string;
    id: string;
}

const currentReservations = ref<Reservation[]>([]);
const currentIndex = ref(0);

const lineChartData = ref({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Revenue',
      data: [1000, 1200, 1500, 1400, 1800, 1700, 1600],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    },
  ],
});

function openModal(input: string){
  isModalOpen.value = true;
  modalTitle.value = input;
  modalType.value = input;
}

function back() {
  if (currentIndex.value > 0){
    currentIndex.value -= 1;
  }
}

function next(){
  if (currentIndex.value < currentReservations.value.length - 1){
    currentIndex.value += 1;
  }
}

const currentReservation = computed(() => {
  return currentReservations.value[currentIndex.value] || null;
});

</script>

<style scoped>
.heading {
  text-align: center;
  margin-top: 1em;
  font-size:larger;
}

.dashboard {
  display: flex;
  flex-direction: column;
  height: 80vh;
  justify-content: space-evenly;
}

.metric-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin: 0.8em;
  height: 18vh;
}
</style>

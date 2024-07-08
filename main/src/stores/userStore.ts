
import { ref, onMounted, watch } from 'vue';
import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';

export type Reservation = {
    title: string;
    content: string;
    id: string;
}

export const userStore = defineStore('userStore', () => {
    const userData = ref<User> ();
    const reservations = ref<Reservation[]> ([]);
    const pastReservations = ref<Reservation[]> ([]);
    const currentAllergies = ref<string[]> ([]);

    return { userData, reservations, pastReservations, currentAllergies };
});

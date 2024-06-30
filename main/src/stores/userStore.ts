
import { ref, onMounted, watch } from 'vue';
import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';

export const userStore = defineStore('userStore', () => {
    const userData = ref<User> ();

    return { userData };
});

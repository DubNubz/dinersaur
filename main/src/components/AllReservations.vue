<template>
    <div class="all" v-if="type == 'upcoming'">
        <h2>{{ $t("upcoming") }}</h2>
        <ReservationCard v-for="reservation in [...userStore().reservations].sort((a, b) => a.time - b.time)"
        :reservation="reservation" />
    </div>
    <div class="all" v-if="type == 'past'">
        <h2>{{ $t("past") }}</h2>
        <ReservationCard v-for="reservation in [...userStore().pastReservations].sort((a, b) => b.time - a.time)"
        :reservation="reservation" :past="true" />
    </div>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/userStore';
import ReservationCard from '@/components/ReservationCard.vue';

type Props = {
    type: "upcoming" | "past";
}

const props = defineProps<Props> ();

</script>

<style lang="scss" scoped>

.all {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

</style>
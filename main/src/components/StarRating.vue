<template>
    <div class="starRating">
        <Star v-for="index in 5" :fill="getStarFill(index)"/>
    </div>
</template>

<script setup lang="ts">

import { ref, defineProps, defineEmits, computed } from 'vue';
import Star from '@/components/Star.vue';

const props = defineProps({
    rating: {
        default: 0,
    },
});

function getStarFill (index: number) {
    return Math.max(0, Math.min(1, props.rating - (index - 1)));
};

</script>

<style lang="scss" scoped>

.starRating {
    display: flex;
}

</style>
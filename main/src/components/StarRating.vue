<template>
    <div class="starRating">
        <Star v-for="index in 5" :fill="getStarFill(index)"/>
    </div>
</template>

<script setup lang="ts">
    import Star from './components/Star.vue';
    const props = defineProps({
        rating: {
            type: Number,
            default: 0,
        },
    });

    const getStarFill = (index: number) => {
        return Math.max(0, Math.min(1, props.rating - (index - 1)));
    };
</script>

<style scoped>

</style>
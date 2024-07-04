<template>
    <div class="star" :style="clipStar" :class="{ filled: isFilled }"></div>
</template>

<script setup lang="ts">

import { ref, defineProps, defineEmits, computed } from 'vue';

type Props = {
    fill: number;
}

const props = defineProps<Props> ();

const roundedFill = Math.round(props.fill * 10) / 10;

const isFilled = computed(() => roundedFill >= 1);

const clipStar = computed(() => {
    if (props.fill != 1) {
        return { clipPath: `polygon(0% 0%, ${roundedFill * 100}% 0%, ${roundedFill * 100}% 100%, 0% 100%)` };
    }
})

</script>

<style lang="scss" scoped>

.star {
    width: 24px;
    height: 24px;
    margin: 0 2px;
    background: gray;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.filled {
    background: gold;
}

</style>
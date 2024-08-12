<template>
    <div class="align">
        <div class="visibi" :style="clipStar"></div>
        <div class="star"></div>
    </div>
</template>

<script setup lang="ts">

import { ref, defineProps, defineEmits, computed } from 'vue';

type Props = {
    fill: number;
}

const props = defineProps<Props>();

const roundedFill = Math.round(props.fill * 10) / 10;

const isFilled = computed(() => roundedFill >= 1);

const clipStar = computed(() => {
    if (props.fill < 1) {
        return { clipPath: `polygon(${(roundedFill * 100)}% 0%, polygon(${(roundedFill * 100)}% 100%, 100% 100%, 100% 0%))`, 
            visibility: roundedFill < 1 ? 'visible' as 'visible' | 'hidden' : 'hidden' as 'visible' | 'hidden',
            width: `${24 - 24 * roundedFill}px`,
            marginLeft: `${24 * roundedFill}px`};
    }
    
})

</script>

<style lang="scss" scoped>

.align {
    position: relative;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: flex-end;
}

.star {
    width: 24px;
    height: 24px;
    background-color: gray;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    position: relative;
    background: gold;
}

.visibi {
    width: 24px;
    height: 24px;
    background-color: var(--ion-color-light);
    position: absolute;
    z-index: 1;
    visibility: hidden;
}

</style>
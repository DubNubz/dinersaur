<template>
    <div class="star" :style="clipStar" :class="{ filled: isFilled }"></div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
    fill:{
        type: Number;
        required: true;
    },
})

const isFilled = computed(() => props.fill >= 1);

if (props.fill == 1){
    return;
} else {
    function clipStar(){
        return { clipPath: `polygon(0% 0%, ${props.fill * 100}% 0%, ${props.fill * 100}% 100%, 0% 100%)` };
    }
}
</script>

<style lang="scss" scoped>
    .star{
        width: 24px;
        height: 24px;
        margin: 0 2px;
        background: gray;
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }
    .star.filled {
        background: gold;
    }
</style>
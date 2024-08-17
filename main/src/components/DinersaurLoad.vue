<template>
    <div class="content">
        <ion-img src="/icons/dinersaurWithShadow.svg"></ion-img>
        <h1 class="sequel">Dinersaur</h1>
        <div class="loadingBar">
            <div class="filler" :style="{ width: `${barPercent - (10 * barPercent * 0.01)}vw` }"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { delay } from '@/utils/functions';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { IonImg } from '@ionic/vue';

type Props = {
    barPercent: number;
    destination: string | null;
}

const props = defineProps<Props> ();

watch(() => props.barPercent, async () => {
    if (props.barPercent >= 100 && props.destination) {
        await delay(500);
        router.push(props.destination);
    }
});

</script>

<style lang="scss" scoped>

.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 30000;
    background-color: var(--ion-color-light);

    h1 {
        font-size: 3em;
    }

    .loadingBar {
        width: 90vw;
        height: 40px;
        background-color: var(--ion-color-dark);
        border-radius: 50px;

        .filler {
            height: 40px;
            border-radius: 50px;
            background-color: var(--ion-color-secondary);
            transition: all 0.5s;
        }
    }
}

</style>
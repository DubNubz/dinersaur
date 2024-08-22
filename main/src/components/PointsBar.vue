<template>
    <div class="pointsCounter">
        <h4><span v-if="userStore().subscribed">(+50% activated)</span> <strong>{{ points.toLocaleString() }}</strong> pts</h4>
        <div class="points">
            <div class="circle" :style="{ left: calculateCirclePosition(points) }">
                <div class="innerCircle"></div>
            </div>
            <div class="bar" :style="{ width: calculateBarWidth(points) }"></div>
        </div>
        <div class="counter"><span :class="{ bold: number <= points }" v-for="number in [1000, 3000, 5000, 7000, 9000]">{{ number }}</span></div>
    </div>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/userStore';
import { delay } from '@/utils/functions';
import { onMounted, ref, watch } from 'vue';

type Props = {
    /** Delay before loading points, in milliseconds */
    delay: number;
}

const props = defineProps<Props> ();

const points = ref(0);
watch(() => userStore().points, (val) => points.value = val);

onMounted(async () => {
  await delay(props.delay);
  points.value = userStore().points;
});

function calculateCirclePosition (points: number) {
  if (points <= 1700 && points >= 1200) return Math.floor(((points / 10000) + 0.025) * 100) + '%';
  else if (points < 4500) return Math.floor((((points / 10000) > 0.075 ? (points / 10000) : 0.075)) * 100) + '%';
  else if (points < 8000) return Math.floor(((points / 10000) - 0.025) * 100) + '%';
  else if (points < 9500) return Math.floor(((points / 10000) - 0.05) * 100) + '%';
  else return '89%';
}

function calculateBarWidth (points: number) {
  if (points < 10000) return Math.floor((1 - ((points / 10000) > 0.075 ? (points / 10000) : 0.05)) * 100) + '%';
  else return 0 + '%';
}

</script>

<style lang="scss" scoped>

.pointsCounter {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  width: 90vw;
  gap: 0.5em;
  margin-top: 0.5em;

  h4 {
    margin: 0;

    span {
      color: var(--ion-color-primary-shade);
      font-size: 60%;
    }
  }
}

.points {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 90vw;
  height: 1em;
  background: linear-gradient(to right, var(--ion-color-primary), var(--ion-color-secondary) 70%);
  border-radius: 2em;

  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.2em;
    height: 1.2em;
    background-color: var(--ion-color-tertiary);
    border-radius: 1.2em;
    position: absolute;
    z-index: 1;
    transition: all 0.75s;

    .innerCircle {
      width: 1em;
      height: 1em;
      background-color: var(--ion-color-light);
      border-radius: 1em;
    }
  }

  .bar {
    height: 100%;
    border-top-right-radius: 2em;
    border-bottom-right-radius: 2em;
    background-color: var(--ion-color-light-shade);
    position: relative;
    transition: all 0.75s;
  }
}

.counter {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;

  .bold {
    font-weight: 700;
  }
}

</style>
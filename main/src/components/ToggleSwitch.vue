<template>
  <div class="toggle-switch" @click="toggle">
    <div :class="{ 'toggle-thumb': true, 'on': isActive }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isActive = ref(false);

function toggle() {
  isActive.value = !isActive.value;
}
</script>

<style scoped>
.toggle-switch {
  width: 60px;
  height: 30px;
  background-color: var(--ion-color-medium);
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-switch .toggle-thumb {
  width: 28px;
  height: 28px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: transform 0.3s;
}

.toggle-switch .toggle-thumb.on {
  transform: translateX(30px);
  background-color: var(--ion-color-primary);
}

.toggle-switch.on {
  background-color: var(--ion-color-primary);
}
</style>

<template>
  <div class="grid-container" :style="{ '--grid-width': props.width }">
    <div
      v-for="(row, rowIndex) in grid"
      :key="rowIndex"
      class="grid-row"
    >
      <div
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        class="grid-cell"
        :class="getCellClass(cell.type)"
        @click="() => selectTile(rowIndex, cellIndex)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/userStore';
import { ref, defineProps, watch, onMounted } from 'vue';

const props = defineProps<{
  length: number;
  width: number;
  selectedItem: string;
  selectedFloorIndex: number;
}>();

onMounted(() => {
  loadLayout();
});

watch(() => props.selectedFloorIndex, loadLayout);
watch(() => [props.length, props.width], ([newLength, newWidth]) => {
  if (grid.value.length !== newLength || grid.value[0]?.length !== newWidth) {
    grid.value = createGrid(newLength, newWidth);
  }
});

const grid = ref(createGrid(props.length, props.width));

function createGrid(propLength: number, propWidth: number){
  return Array.from({ length: propLength }, () =>
    Array.from({ length: propWidth }, () => ({ type: '' }))
  );
}

function selectTile(rowIndex: number, cellIndex: number) {
  if (grid.value[rowIndex][cellIndex].type === props.selectedItem){
      grid.value[rowIndex][cellIndex].type = '';
  } else {
    grid.value[rowIndex][cellIndex].type = props.selectedItem;
  }
  saveLayout();
}

function getCellClass(type: string) {
  switch(type) {
    case 'Table':
      return 'table';
    case 'Chair':
      return 'chair';
    case 'Wall':
      return 'wall';
    default:
      return '';
  }
}

function saveLayout() {
  userStore().saveLayout(props.selectedFloorIndex, grid.value);
}

function loadLayout() {
  const savedLayout = userStore().loadLayout(props.selectedFloorIndex);
  if (savedLayout.length > 0) {
    grid.value = savedLayout;
  } else {
    grid.value = createGrid(props.length, props.width);
  }
}

</script>

<style>
.grid-container {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(var(--grid-width), 50px);
  background-color: var(--ion-color-light); 
  padding: 20px; 
  padding-top: 40px;
  padding-bottom: 40px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
  border-radius: 15px; 
}

.grid-row {
  display: contents;
}

.grid-cell {
  width: 50px;
  height: 50px;
  border: 2px solid var(--ion-color-medium); 
  border-radius: 5px; 
  transition: transform 0.2s; 
}

.grid-cell.table {
  background-color: mediumpurple;
}

.grid-cell.chair {
  background-color: var(--ion-color-secondary-tint);
}

.grid-cell.wall {
  background-color: black;
}

.grid-cell:hover {
  transform: scale(1.05); 
  border-color: var(--ion-color-primary); 
}
</style>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Restaurant Layout</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="canvas-container">
        <v-stage ref="stage" :config="stageConfig">
          <v-layer ref="layer">
            <v-rect
              v-for="(table, index) in tables"
              :key="index"
              :config="table"
              @dragend="handleDragEnd(index, $event)"
            />
          </v-layer>
        </v-stage>
      </div>
      <ion-button @click="addTable">Add Table</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VStage, VLayer, VRect } from 'vue-konva';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

const stageConfig = {
  width: window.innerWidth,
  height: window.innerHeight - 200,
};

const tables = ref([
  {
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    fill: 'brown',
    draggable: true,
  },
]);

const addTable = () => {
  tables.value.push({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    fill: 'brown',
    draggable: true,
  });
};

const handleDragEnd = (index: number, event: any) => {
  const { x, y } = event.target.attrs;
  tables.value[index] = {
    ...tables.value[index],
    x,
    y,
  };
};
</script>

<style scoped>
.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
v-stage {
  border: 1px solid black;
}
</style>

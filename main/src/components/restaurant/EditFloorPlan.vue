<template>
    <div class="component" v-if="currentLayout">
        <div class="floorPlan">
            <div class="floor" v-for="floor in currentLayout[0]">
                <div class="row" v-for="(row, rowIndex) in floor[currentFloor - 1]">
                    <div class="cell" v-for="(cell, cellIndex) in row" ref="cells" @click="changeTile(rowIndex, cellIndex)"
                    :tabindex="cellIndex == currentMiddleRow && rowIndex == currentMiddleColumn ? 1 : undefined"
                    :class="{ void: cell == -1, empty: cell == 0, chair: cell == 1, table: cell == 2, door: cell == 3, bathroom: cell == 4 }">
                    </div>
                </div>
            </div>
        </div>
        <ion-button style="position: fixed; top: 20em;" @click="editFloor">Edit Floor</ion-button>
        <div class="tileSelect">
            <div class="select" @click="selected = selection" v-for="selection in selections" :class="{ selected: selected == selection }">
                <div class="cell" :class="selection"></div>
                <p>{{ selection }}</p>
            </div>
        </div>
        <ion-fab>
            <ion-fab-button><ion-icon :icon="crop"></ion-icon></ion-fab-button>
            <ion-fab-list side="top">
                <ion-fab-button translucent><ion-icon :icon="trash"></ion-icon></ion-fab-button>
                <ion-fab-button translucent><ion-icon :icon="arrowUndo"></ion-icon></ion-fab-button>
                <ion-fab-button translucent><ion-icon :icon="save"></ion-icon></ion-fab-button>
            </ion-fab-list>
            <ion-fab-list side="start">
                <ion-fab-button translucent><ion-icon :icon="trash"></ion-icon></ion-fab-button>
                <ion-fab-button translucent><ion-icon :icon="arrowUndo"></ion-icon></ion-fab-button>
                <ion-fab-button translucent><ion-icon :icon="save"></ion-icon></ion-fab-button>
            </ion-fab-list>
        </ion-fab>
    </div>
</template>

<script setup lang="ts">

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonImg, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  IonButton, IonButtons, IonIcon, IonList, IonCardSubtitle, onIonViewDidEnter, IonModal, IonBadge, IonProgressBar, IonFab, IonFabButton, IonFabList, 
  onIonViewWillEnter} from '@ionic/vue';
import { RestaurantInfo, userStore } from '@/stores/userStore';
import { ref, watch, onMounted, onBeforeMount } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { delay } from '@/utils/functions';
import { add, arrowUndo, colorFill, crop, save, trash } from 'ionicons/icons';

const currentLayout = ref<Record<number, Record<number, number[]>[]>[]> ();

const selections = ref<("void" | "empty" | "chair" | "table")[]> (["void", "empty", "chair", "table"]);
const selected = ref<"void" | "empty" | "chair" | "table"> ("empty");
const currentFloor = ref(1);

const currentMiddleRow = ref(0);
const currentMiddleColumn = ref(0);

onBeforeMount(() => {
    const restaurant = userStore().restaurant;
    const layout = restaurant?.layout;

    const largestDimension = document.body.clientHeight > document.body.clientWidth ? document.body.clientHeight : document.body.clientWidth;
    const rows = Math.floor((largestDimension * 2.5) / 40);
    const columns = Math.floor((largestDimension * 2.5) / 40);

    const mainGrid: Record<number, number[]> = {};
    for (let i = 0; i < columns; i++) {
        mainGrid[i] = Array(rows).fill(-1);
    }

    const middleRow = Math.floor(rows / 2);
    const middleColumn = Math.floor(columns / 2);
    currentMiddleRow.value = middleRow;
    currentMiddleColumn.value = middleColumn;
    
    if (restaurant && layout && layout?.length != 0) {
        const layoutTranslated = LayoutToFloor(layout, 1);
        const floorTranslated = FloorTo2DArray(layoutTranslated);
        const layoutRows = floorTranslated.length;
        const layoutColumns = floorTranslated[0].length;

        const startRow = middleRow - Math.floor(layoutRows / 2);
        const startColumn = middleColumn - Math.floor(layoutColumns / 2);

        for (let i = 0; i < layoutRows; i++) {
            for (let j = 0; j < layoutColumns; j++) {
                mainGrid[startColumn + i][startRow + j] = layoutTranslated[i][j];
            }
        }

    } else {
        const startRow = middleRow - 4;
        const endRow = middleRow + 4;
        const startColumn = middleColumn - 4;
        const endColumn = middleColumn + 4;

        for (let i = startColumn; i <= endColumn; i++) {
            for (let j = startRow; j <= endRow; j++) {
                mainGrid[i][j] = 0;
            }
        }
    }

    currentLayout.value = [{ 0: [mainGrid] }];
});

onMounted(async () => {
    const middleCell = document.querySelector('[tabindex="1"]') as HTMLElement | undefined;
    await delay(100);
    if (middleCell) middleCell.focus();
});

/** Translate restaurant layout object to floor object.
 * @param Layout `[{ 0: [{ 0: [a, b, c], 1: [x, y, z] }] }]`
 * @returns `{ 0: [a, b, c], 1: [x, y, z] }`
 */
function LayoutToFloor (layout: Record<number, Record<number, number[]>[]>[], floor: number) {
    return layout[0][floor - 1][0];
}

/** Translate floor object to floor array.
 * @param Obj `{ 0: [a, b, c], 1: [x, y, z] }`
 * @returns `[[a, b, c], [x, y, z]]`
 */
function FloorTo2DArray (obj: Record<number, number[]>) {
    const result: number[][] = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
        result.push(obj[key]);
        }
    }

    return result;
}

/** Translate floor array to layout object.
 * @param Array `[[a, b, c], [x, y, z]]`
 * @returns `{ 0: [a, b, c], 1: [x, y, z] }`
 */
function TwoDArrayToLayout (array: number[][], floorNumber: number) {
    const floor: Record<number, number[]> = {};
  
    for (let i in array) {
        floor[i] = array[i];
    }

    return [{ [floorNumber - 1]: [floor] }];
}

function translateSelection (selection: "void" | "empty" | "chair" | "table") {
    switch (selection) {
        case "void":
            return -1;
        case "empty":
            return 0;
        case "chair":
            return 1;
        case "table":
            return 2;
        default: return -1;
    }
}

function changeTile (rowIndex: number, cellIndex: number) {
    if (!currentLayout.value) return;
    LayoutToFloor(currentLayout.value, currentFloor.value)[rowIndex][cellIndex] = translateSelection(selected.value);
}

async function editFloor () {
    const store = userStore();
    if (!currentLayout.value || !store.restaurant) return;

    const floor = currentFloor.value;
    const layout = FloorTo2DArray(LayoutToFloor(currentLayout.value, floor));
    if (!layout || !floor) return;

    const numRows = layout.length;
    const numCols = layout[0].length;

    const visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
    
    let left: number | null = null;
    let right: number | null = null;
    let top: number | null = null;
    let bottom: number | null = null;

    function depthFirstSearch(x: number, y: number) {
        // If out of bounds or the cell is already visited
        if (x < 0 || x >= numRows || y < 0 || y >= numCols || visited[x][y] || layout[x][y] === -1) {
            return;
        }

        visited[x][y] = true;

        // Update boundaries
        if (top === null || x < top) top = x;
        if (bottom === null || x > bottom) bottom = x;
        if (left === null || y < left) left = y;
        if (right === null || y > right) right = y;

        // Explore all four directions
        depthFirstSearch(x + 1, y); // Down
        depthFirstSearch(x - 1, y); // Up
        depthFirstSearch(x, y + 1); // Right
        depthFirstSearch(x, y - 1); // Left
    }

    // Find the first non-zero cell to start DFS
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (layout[i][j] !== -1 && !visited[i][j]) {
                depthFirstSearch(i, j);
            }
        }
    }

    // Check if any subgrid was found
    if (top === null || bottom === null || left === null || right === null) return; // No non-zero grid found
    

    // Extract the subgrid based on calculated boundaries
    const subGrid: number[][] = [];
    for (let i = top; i <= bottom; i++) {
        const row: number[] = [];

        for (let j = left; j <= right; j++) { row.push(layout[i][j]) }

        subGrid.push(row);
    }

    const finishedLayout = TwoDArrayToLayout(subGrid, floor);

    console.log(subGrid);
    console.log(finishedLayout)

    try {
        await updateDoc(doc(db, "restaurants", userStore().userData?.uid ?? ""), { layout: finishedLayout });
        store.restaurant.layout = finishedLayout;

    } catch (error) {
        console.error(error);
    }
}

</script>

<style lang="scss" scoped>

.component {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    overflow-x: scroll;
}

.floorPlan {
    display: flex;
    align-items: center;
    justify-content: center;
}

.floor {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
}

.row {
    display: flex;
    align-items: center;
    justify-content: center;
}

.cell {
    width: 2.5em;
    height: 2.5em;
    outline: 1px solid black;
}

.void {
    background-color: black;
    outline: 1px solid #522596;
}
.empty {
    background-color: var(--ion-color-light-shade);
}
.chair {
    background-color: green;
}
.table {
    background-color: blue;
}
.door {
    background-color: red;
}
.bathroom {
    background-color: pink;
}

.tileSelect {
    background-color: var(--ion-color-light);
    position: fixed;
    top: 4.5em;
    width: 92.5%;
    margin-left: 3.75%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 5em;
    border-radius: 1em;
    outline: 1px solid var(--ion-color-primary);

    .select {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 0.5em;
        width: 25%;
        height: 5em;

        p {
            margin: 0;
        }
    }

    .select:first-child {
        border-top-left-radius: 1em;
        border-bottom-left-radius: 1em;
    }
    .select:last-child {
        border-top-right-radius: 1em;
        border-bottom-right-radius: 1em;
    }

    .selected {
        background-color: var(--ion-color-success-tint);
    }
}

ion-fab {
    position: fixed;
    bottom: 1em;
    right: 1em;
}

</style>
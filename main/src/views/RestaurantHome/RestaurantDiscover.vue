<template>
  <ion-menu side="start" menu-id="second" content-id="discover">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu Categories</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item v-for="(category, index) in categories" :key="index" class="category-item">
          <ion-label>{{ category }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

  <ion-page id="discover">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Create Menu</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="addNewMenuItem">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-modal :is-open="isIonModalOpen" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75]" @didDismiss="closeModal">
        <ion-list>
          <ion-item>
            <ion-label position="stacked">Item Name</ion-label>
            <ion-input v-model="newItem.name"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Category</ion-label>
            <ion-select placeholder="Select One" v-model="newItem.category">
              <ion-select-option v-for="(category, index) in categories" :key="index">{{ category }}</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Price</ion-label>
            <ion-input type="number" v-model="newItem.price"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Description</ion-label>
            <ion-textarea v-model="newItem.description"></ion-textarea>
          </ion-item>
          <ion-button v-if="!isButtonHidden" expand="full" :disabled="!isNewItemValid()" @click="addItem">Add Item</ion-button>
        </ion-list>
      </ion-modal>

      <ion-list>
        <ion-card v-for="item in menu" :key="item.id" class="menu-card">
          <ion-card-header>
            <ion-card-title>{{ item.name }} - ${{ item.price }}</ion-card-title>
            <ion-card-subtitle>{{ item.category }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>{{ item.description }}</p>
            <ion-icon :icon="pencil" @click="editItem(item)" class="edit-icon"></ion-icon>
            <ion-icon :icon="trash" @click="deleteItem(item.id)" class="delete-icon"></ion-icon>
          </ion-card-content>
        </ion-card>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openCategoryModal">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="isCategoryModalOpen" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75]" @didDismiss="isCategoryModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>List of Categories</ion-title>
            <ion-buttons slot="end">
              <ion-button v-if="!isEditing" @click="toggleEditing">Edit</ion-button>
              <ion-button v-if="isEditing" @click="saveCategories">Save</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-list>
            <ion-reorder-group v-if="isEditing" @ionItemReorder="reorderCategories($event)" :disabled="false" :key="categoriesKey">
              <ion-item-sliding v-for="(category, index) in categories" :key="index">
                <ion-item>
                  <ion-label>{{ category }}</ion-label>
                  <ion-reorder slot="end"></ion-reorder>
                </ion-item>
                <ion-item-options side="end">
                  <ion-item-option color="danger" @click="deleteCategory(index)">
                    <ion-icon :icon="trash"></ion-icon>
                  </ion-item-option>
                </ion-item-options>
              </ion-item-sliding>
            </ion-reorder-group>
            <ion-item v-else v-for="(category, index) in categories" :key="index" class="category-item">
              <ion-label>{{ category }}</ion-label>
            </ion-item>
            <div v-if="isButtonHidden" class="divider"></div>
            <ion-item v-if="isEditing && addingCategory">
              <ion-label position="stacked">New Category</ion-label>
              <ion-input v-model="newCategory"></ion-input>
            </ion-item>
            <ion-button v-if="isEditing" expand="full" @click="toggleAddCategory">
              {{ addingCategory ? 'Add Category' : 'New Category' }}
            </ion-button>
          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/userStore';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardContent, IonIcon, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonInput, IonSelectOption, IonLabel, IonSelect, IonButton, IonTextarea, IonModal, IonMenu, IonFab, IonFabButton, IonReorder, IonReorderGroup, IonButtons, IonItemSliding, IonItemOption, IonMenuButton, IonItemOptions } from '@ionic/vue';
import { add, pencil, trash } from 'ionicons/icons';
import { ref, onUnmounted, onMounted, watch } from 'vue';

const isIonModalOpen = ref(false);
const blankItem = {
  id: 0,
  name: "",
  category: "",
  description: "",
  price: 0
}
const newItem = ref<MenuItem>({...blankItem});
const menu = ref<MenuItem[]>([]);
const categories = ref<string[]>(['Appetizer', 'Main Course', 'Dessert', 'Special Deals']);
const categoriesKey = ref(0); 

const isCategoryModalOpen = ref(false);
const isEditing = ref(false);
const addingCategory = ref(false);
const newCategory = ref('');

const isButtonHidden = ref(false);

type MenuItem = {
  id: number, 
  name: string, 
  category: string, 
  description: string,
  price: number
}

function addNewMenuItem(){
  newItem.value = {...blankItem}; 
  isIonModalOpen.value = true;
  isButtonHidden.value = false;
}

function closeModal() {
  isIonModalOpen.value = false;
  newItem.value = {...blankItem}; 
}

function isNewItemValid(){
  return ( newItem.value.name.trim() !== "" && newItem.value.category.trim() !== "" && newItem.value.description.trim() !== "" && newItem.value.price >= 0 );
}

function addItem(){
  newItem.value.id = menu.value.length + 1;
  menu.value.push({...newItem.value});  
  closeModal();
} 

function editItem(item: MenuItem) {
  newItem.value = item;
  isButtonHidden.value = true;
  isIonModalOpen.value = true;
}

function deleteItem(itemId: number) {
  menu.value = menu.value.filter(item => item.id !== itemId);
}

function toggleEditing() {
  isEditing.value = true;
}

function toggleAddCategory() {
  if (addingCategory.value && newCategory.value.trim() !== '') {
    categories.value.push(newCategory.value);
    newCategory.value = '';
  }
  addingCategory.value = !addingCategory.value;
}

function deleteCategory(index: number) {
  categories.value.splice(index, 1);
}

function reorderCategories(event: any) {
  const localVar = categories.value[event.detail.from];
  categories.value.splice(event.detail.from, 1);
  categories.value.splice(event.detail.to, 0, localVar);
  categoriesKey.value += 1;
  event.detail.complete();
}

function saveCategories() {
  isEditing.value = false;
  isIonModalOpen.value = false;
}

function openCategoryModal() {
  isCategoryModalOpen.value = true;
}

onUnmounted(() => {
  userStore().menu = menu.value;
  userStore().categories = categories.value;
})

onMounted(() => {
  menu.value = userStore().menu;
  categories.value = userStore().categories;
})
</script>

<style scoped>
.category-item {
  transition: background-color 0.3s ease;
}

.category-item:hover {
  background-color: var(--ion-color-primary-shade);
}

.edit-icon, .delete-icon {
  font-size: 24px;
  color: var(--ion-color-primary);
  cursor: pointer;
  transition: color 0.3s ease;
}

.edit-icon:hover, .delete-icon:hover {
  color: var(--ion-color-danger);
}

.menu-card {
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
}

.menu-card ion-card-header {
  transition: background-color 0.3s ease;
}

.menu-card ion-card-header:hover {
  background-color: var(--ion-color-primary-tint);
}

.divider {
  width: 95vw;
  height: 1px;
  margin: 10px;
  background-color: black;
}

.ion-page, ion-modal {
  transition: all 0.3s ease;
}
</style>

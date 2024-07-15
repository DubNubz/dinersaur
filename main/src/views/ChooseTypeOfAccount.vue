<template>
    <ion-page>
        <ion-content>
        <div class="divOne">
        <ion-img class="dinersaur" src="/icons/dinersaurWithShadow.svg" alt="Dinersaur"></ion-img>
            <ion-label class="text">Welcome To Dinersaur!<br>Select Your Type Of Account:</ion-label>
        </div>
        <div class="divTwo">
            <ion-button class="button" @click="customerAccount">
                <div class="button-content">
                Customer
                <img src="/icons/customer.png">
                </div>
            </ion-button>
            <ion-button class="button" @click="restaurantAccount">
                <div class="button-content">
                Restaurant
                <img src="/icons/restaurant.png">
                </div>
            </ion-button>
        </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

import router from '@/router';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonLabel, IonButton } from '@ionic/vue';

function customerAccount() {
    router.push("/login");
}

function restaurantAccount(){
    router.push("/restaurantLogin");
}

</script>

<style scoped>

.divOne{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    margin-top: 5vh;
}

.text{
    margin-top: 1em;
    font-size: 1.8em;
}

.divTwo{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-top: 3em;
    margin-bottom: 5vh; 
}

.button{
    display: flex;
    width: 40%;
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.button-content img {
  margin-top: 0.5em; 
}

</style>
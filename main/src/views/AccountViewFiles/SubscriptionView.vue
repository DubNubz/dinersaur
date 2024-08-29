<template>
  <ion-page>
    
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/pages/account"></ion-back-button>
        </ion-buttons>
        <ion-title>Steakosaurus</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">

      <SubscriberAd :type="'money'" v-if="!userStore().subscription.currentlySubscribed"
      @processing="handleProcessing" @success="handleSuccess" @failed="(msg) => handleFail(msg)" />

      <ion-modal ref="outcomeModal" :is-open="showModal" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.65]" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-progress-bar type="indeterminate" v-if="!success && !failed"></ion-progress-bar>
          </ion-toolbar>
        </ion-header>
        
        <ion-content>
          <div class="message" v-if="!success && !failed">
            <h1>Processing...</h1>
            <p>Please do not close the app.</p>
          </div>
          
          <Transition name="subscriptionAd">
            <div class="message" v-if="success">
              <h1>Congratulations!</h1>
              <h4>Enjoy your new Steakosaurus perks and benefits!</h4>
              <p>You may now close this window.</p>
              <img src="/icons/steakosaurusRight.svg">
            </div>
          </Transition>
          
          <div class="message" v-if="failed">
            <h1>Transaction failed.</h1>
            <p>{{ failMessage }}</p>
            <p>You may now close this window.</p>
            <img src="/icons/dinersaurWithShadow.svg">
          </div>
        </ion-content>
      </ion-modal>

    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">

import SubscriberAd from '@/components/SubscriberAd.vue';
import { userStore } from '@/stores/userStore';
import { IonPage, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonProgressBar, IonModal } from '@ionic/vue';
import { ref } from 'vue';

const outcomeModal = ref();

const openSubscriptionModal = ref(false);
const showModal = ref(false);
const success = ref(false);
const failed = ref(false);
const failMessage = ref("");

function handleProcessing () {
  showModal.value = true;
}

function handleSuccess () {
  openSubscriptionModal.value = false;
  outcomeModal.value?.$el.setCurrentBreakpoint(0.65);
  success.value = true;
}

function handleFail (message: string) {
  openSubscriptionModal.value = false;
  outcomeModal.value?.$el.setCurrentBreakpoint(0.65);
  failMessage.value = message;
  failed.value = true;
}

function closeModal () {
  showModal.value = false;
  success.value = false;
  failed.value = false;
}

</script>

<style lang="scss" scoped>

.message {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  h1 {
    margin-bottom: 0;
  }

  img {
    width: 75%;
  }
}

</style>
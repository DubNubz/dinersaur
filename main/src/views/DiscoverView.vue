<template>
  <ion-page>
    <ion-content>
      <video ref="video1" width="1080" height="1920" class="video" autoplay controls loop disablepictureinpicture disableremoteplayback muted>
        <source src="/Baby Shark (360p).mp4" type="video/mp4" />
      </video>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon :icon="heartOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonFab, IonFabButton, IonIcon, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonImg } from '@ionic/vue';
import { heartOutline } from 'ionicons/icons';

const video1 = ref<HTMLElement> ();

onMounted(() => {
  video1.value?.removeAttribute("muted")
})

</script>

<style lang="scss" scoped>

.video {
  width: 100%;
  height: 99%;
  overflow: hidden;
}

</style>

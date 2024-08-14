import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { createPinia } from 'pinia';

import { initializeApp } from "firebase/app";
import { firebaseConfig } from './utils/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import VueKonva from 'vue-konva';

import { createI18n } from 'vue-i18n'
import { en } from '../locales/en';
import { fr } from '../locales/fr';
import { ar } from '../locales/ar';
import { ru } from '../locales/ru';
import { bn } from '../locales/bn';
import { zhSimplified } from '../locales/zhSimplified';
import { zhTraditional } from '../locales/zhTraditional';
import { de } from '../locales/de';
import { hi } from '../locales/hi';
import { id } from '../locales/id';
import { ja } from '../locales/ja';
import { fil } from '../locales/fil';
import { ko } from '../locales/ko';
import { pt } from '../locales/pt';
import { es } from '../locales/es';
import { vi } from '../locales/vi';

defineCustomElements(window);

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en, fr, ar, ru, bn, zhSimplified, zhTraditional, de, hi, id, ja, fil, ko, pt, es, vi }
});
const pinia = createPinia();
const app = createApp(App)
  .use(i18n)
  .use(IonicVue)
  .use(router)
  .use(VueKonva);

const firebaseApp = initializeApp(firebaseConfig);
getAuth(firebaseApp);
getFirestore(firebaseApp);

router.isReady().then(() => {
  app.use(pinia);
  app.mount('#app');
});

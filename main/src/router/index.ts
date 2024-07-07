import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/pages/home'
  }, {
    path: '/login',
    component: () => import("@/views/LoginView.vue")
  }, {
    path: '/pages/',
    component: () => import('@/views/TabsPage.vue'),
    children: [
      { path: '', redirect: '/pages/home'},
      { path: 'home', component: () => import('@/views/HomeView.vue') },
      { path: 'discover', component: () => import('@/views/DiscoverView.vue') },
      { path: 'account', component: () => import('@/views/AccountView.vue'), children: [
        { path: 'allergies', component: () => import('@/views/AccountViewFiles/AllergiesView.vue') },
        { path: 'billing', component: () => import('@/views/AccountViewFiles/BillingView.vue') },
        { path: 'language', component: () => import('@/views/AccountViewFiles/LanguageView.vue') },
        { path: 'account', component: () => import('@/views/AccountViewFiles/AccountSettingsView.vue') }
      ] },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

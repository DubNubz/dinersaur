import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: () => import("@/views/InitialLoadView.vue")}, 
  { path: '/chooseAccount', component: () => import("@/views/ChooseTypeOfAccount.vue")},
  { path: '/restaurantLogin', component: () => import("@/views/RestaurantLoginView.vue") },
  { path: '/login', component: () => import("@/views/LoginView.vue")}, {
    path: '/pages/',
    component: () => import('@/views/TabsPage.vue'),
    children: [
      { path: '', redirect: '/pages/home'},
      { path: 'home', component: () => import('@/views/HomeView.vue') },
      { path: 'discover', component: () => import('@/views/DiscoverView.vue') },
      { path: 'account/', component: () => import('@/views/InitialAccountView.vue') },
      { path: 'map', component: () => import('@/views/HomeViewFiles/GoogleMapsView.vue')}
    ]
  }, {
    path: '/restaurant/',
    component: () => import('@/views/RestaurantHome/RestaurantTabsPage.vue'),
    children: [
      { path: '', redirect: '/restaurant/home' },
      { path: 'home', component: () => import('@/views/RestaurantHome/RestaurantHome.vue') },
      { path: 'discover', component: () => import('@/views/RestaurantHome/RestaurantDiscover.vue') },
      { path: 'account/', component: () => import('@/views/RestaurantHome/InitialRestaurantAccountView.vue') },
      { path: 'map', component: () => import('@/views/RestaurantHome/RestaurantMap.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AppHome from './components/AppHome.vue';
import AppPage from './components/AppPage.vue';
import AppError404 from './components/AppError404.vue';
import AppStats from './components/AppStats.vue';
import AppContacts from './components/AppContacts.vue';
import AppLogin from './components/AppLogin.vue';
import AppBody from './components/AppBody.vue';
import AppCompare from './components/AppCompare.vue';

const routes: Array<RouteRecordRaw> = [
  {
    name: 'login',
    path: '/login',
    component: AppLogin,
  },
  {
    path: '/app',
    component: AppBody,
    children: [
      {
        path: '/',
        component: AppHome,
      },
      {
        name: 'stats',
        path: '/stats/:group',
        component: AppStats,
      },
      {
        name: 'compare',
        path: '/compare/',
        component: AppCompare,
      },
      {
        name: 'contacts',
        path: '/contacts',
        component: AppContacts,
      },
      {
        name: 'page',
        path: '/:slug',
        component: AppPage,
      },
      {
        name: 'NotFound',
        path: '/:pathMatch(.*)*',
        component: AppError404,
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;

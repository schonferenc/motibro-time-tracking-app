import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'daily',
        component: () => import('pages/DailyViewPage.vue'),
      },
      {
        path: 'weekly',
        component: () => import('pages/WeeklyViewPage.vue'),
      },
      {
        path: 'monthly',
        component: () => import('pages/MonthlyViewPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

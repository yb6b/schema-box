import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    alias: '/racer',
    component: () => import('@/pages/racer/racer-page.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/error-not-found.vue'),
  },
]

export default routes

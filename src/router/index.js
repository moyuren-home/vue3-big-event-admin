import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

// createRouter 创建路由实例
// 配置 history 模式
// 1. history模式: createWebHistory  地址栏不带 #
// 2. hash模式: createWebHashHistory 地址栏带 #

// vite 中的环境变量 import.meta.env.BASE_URL

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录拦截器 => 默认直接放行
// 根据返回值决定是放行还是拦截
// 返回值：
// 1. underfined / true直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象，拦截到对应地址

router.beforeEach((to) => {
  // 如果没有token，且访问的是非登录页，拦截到登录页
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router

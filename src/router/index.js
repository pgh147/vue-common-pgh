import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

/**
 * 固定的路由
 * 没有权限限制，所有的角色均可访问
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/factory/login',
    name: 'FactoryLogin',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    name: 'ErrPage404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

/**
 * 异步的路由
 * 根据用户的角色权限动态的加载路由
 */
export const asyncRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: '工作台',
      icon: 'icon-首页'
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页' }
      },
      {
        name: 'HomeMessageList',
        path: '/message-list',
        component: () => import('@/views/MessageCenter/List/index.vue'),
        meta: { title: '消息列表' }
      },
      {
        path: '/workflow-await',
        name: 'HomeWorkflowAwait',
        component: () => import('@/views/System/Workflow/Await/index.vue'),
        meta: { title: '待办任务' }
      },
      {
        path: '/workflow-complate',
        name: 'HomeWorkflowComplate',
        component: () => import('@/views/System/Workflow/Complate/index.vue'),
        meta: { title: '已办任务' }
      },
      {
        path: '/factory/purchasing-back',
        name: 'FactoryPurchasingBack',
        component: () => import('@/views/Factory/PurchasingBack/index.vue'),
        meta: {
          title: '工厂回货确认'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 创建路由实例
 */
const createRouter = () => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

/**
 * 重置路由
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router

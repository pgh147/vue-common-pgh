import router from './router'
import { getToken } from '@/utils/auth'
import store from './store'
import Cookies from 'js-cookie'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/factory/login']

// eslint-disable-next-line space-before-function-paren
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasUserInfo = Object.keys(store.getters.user_info)?.length
      const hasRoles = store.getters.permission_routes?.length
      let routers = []
      if (!hasUserInfo) {
        try {
          routers = await store.dispatch(
            'auth/getUserInfo'
          )
        } catch (error) {
          console.error(error)
          store.dispatch('auth/logout')
          return
        }
      }
      if (!hasRoles) {
        const accessRoutes = await store.dispatch(
          'permission/generateRoutes',
          { routers }
        )
        router.addRoutes(accessRoutes)
        // eslint-disable-next-line eqeqeq
        if (Cookies.get('isFactory') == '1') {
          next('/purchasing-back/registration')
        } else {
          next({ ...to, replace: true })
        }
      } else {
        if (to.name) store.dispatch('app/changeSidebarMenus', to)
        // eslint-disable-next-line eqeqeq
        if (Cookies.get('isFactory') == '1' && to.path === '/dashboard') {
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          next()
        }
      }
    }
  } else {
    if (to.path === '/factory/login') {
      next()
    } else if (process?.env?.VUE_APP_ENV === 'uat') {
      window.location.href = 'http://portal-uat.idolove.com/'
    } else if (process?.env?.VUE_APP_ENV === 'tester') {
      window.location.href = 'http://portal-stg.idolove.com/'
    } else if (process?.env?.VUE_APP_ENV !== 'development') {
      window.location.href = 'http://hscm-test.idolove.com/'
    } else if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

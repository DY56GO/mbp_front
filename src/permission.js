import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
import otherRoutes from '@/router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist

// eslint-disable-next-line space-before-function-paren
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          // asyncRouter
          const menus = store.getters.menus
          if (menus && menus.length > 0) {
            const asyncRouter = buildRouter(menus)
            asyncRouter.concat(otherRoutes)
            router.addRoutes(asyncRouter)
            global.asyncRouter = asyncRouter
          } else {
            global.asyncRouter = []
          }
          next({
            ...to,
            replace: true
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          this.$message({
            showClose: true,
            message: error || 'Has Error',
            type: 'error',
            duration: 1500
          })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// build router
function buildRouter(menus) {
  const routerObj = []
  menus.map(item => {
    // if you don't rebuild the route, you will see an error
    const obj = {
      path: item.path,
      component: item.component ? (resolve) => require([`@/views${item.component}`], resolve) : Layout,
      name: item.name,
      meta: { title: item.title, icon: item.icon }
    }

    if (item.children) {
      obj.redirect = item.redirect
      obj['children'] = buildRouter(item.children)
    }
    routerObj.push(obj)
  })
  return routerObj
}

import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getMenu } from "@/api/user"
import { getLocationOptions } from "@/api/location"

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  let hasRoute = store.state.menu.hasRoutes

  if (hasToken) {
    // 拿到menuList
    getMenu().then(res => {
      store.commit("setMenuList", res.data.data.menus)
      // 拿到用户权限
      store.commit("setPermissionList", res.data.data.permissions)

      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        console.log(hasRoute)
        if (!hasRoute) {
          try {
            let newRoutes = router.options.routes
            getLocationOptions().then(res => {
              res.data.data.forEach(menu => {
                let route = menuToRoute(menu)
                newRoutes[3].children.push(route)
              })

              console.log(newRoutes)
              router.addRoutes(newRoutes)
              hasRoute = true
              store.commit("changeRouteStatus", hasRoute)
              next()
            })
          } catch (error) {
            // remove token and go to login page to re-login
            store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
        console.log('has route')
        setTimeout(next, 1000)
        // next();
      }
    })
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

// 导航转成路由
const menuToRoute = (menu) => {
  let route = {
      name: 'Location' + menu.id,
      path: 'location/' + menu.id,
      params: {
        device: menu.id
      },
      meta: {
        title: menu.name
      }
  }
  route.component = () => import('@/views/factory/index')
  return route
}

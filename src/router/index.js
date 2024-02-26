import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/projects',
    component: Layout,
    name: 'Projecta',
    meta: {
      title: '课题a',
      icon: 'el-icon-office-building'
    },
    children: [
      // {
      //   path: 'location/1',
      //   component: () => import('@/views/factory/index'), // Parent router-view
      //   name: 'Menu1',
      //   meta: { title: '场站1' },
      //   query: {
      //     device: 1
      //   }
      // },
      // {
      //   path: 'location/2',
      //   component: () => import('@/views/factory/index'),
      //   name: 'Menu2',
      //   meta: { title: '场站2' },
      //   params: {
      //     device: 2
      //   }
      // }
    ]
  },
  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Project',
        component: () => import('@/views/project/index'),
        meta: { title: '课题', icon: 'el-icon-s-tools' }
      }
    ]
  },
  {
    path: '/science',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Science',
        component: () => import('@/views/science/index'),
        meta: { title: '实验', icon: 'table' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户', icon: 'user' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    children: [
      {
        path: 'password',
        name: 'Password',
        component: () => import('@/views/system/password'),
        meta: { title: '修改密码', icon: '' },
        hidden: true
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

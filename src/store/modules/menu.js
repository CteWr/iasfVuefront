import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    state: {
        menuList: [],
        permissionList: [],
        hasRoutes: false,
    },
    mutations: {
        setMenuList(state, menus) {
            state.menuList = menus
        },
        setPermissionList(state,permissions) {
            state.permissionList = permissions
        },
        changeRouteStatus(state, hasRoutes) {
            state.hasRoutes = hasRoutes
        },
        resetState: (state) => {
            state.menuList = []
            state.permissionList = []
            state.hasRoutes = false
        }
    },
    actions: {
    },
}
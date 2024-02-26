import Vue from "vue"

Vue.mixin({
  methods: {
    hasAuth(perm) {
      var authority = this.$store.state.menu.permissionList

      return authority.indexOf(perm) > -1
    }
  }
})
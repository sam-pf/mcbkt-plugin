import Vue from 'vue'
import Router from 'vue-router'
import Panel from '@/components/panel'

Vue.use (Router)

export default new Router ({
  routes: [
    {
      path: '/',
      name: 'Panel',
      component: Panel
    },
  ]
})

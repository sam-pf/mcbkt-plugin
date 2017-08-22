import Vue from 'vue'
import Router from 'vue-router'
import Panel from '@/components/panel'
import MapTableH from '@/components/map_table_h'

Vue.use (Router)

export default new Router ({
  routes: [
    {
      path: '/',
      name: 'Panel',
      component: Panel
    },
    {
      path: '/mth',
      name: 'MapTableH',
      component: MapTableH
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'
import Panel from '@/components/panel_for_student'

Vue.use (Router)

export default new Router ({
  routes: [
    {
      path: '/',
      name: 'Panel',
      component: Panel,
      props: {
         heading: '',
         unit_activity_type: 'challenge'
      }
    },
  ]
})

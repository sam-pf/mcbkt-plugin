import Vue from 'vue'
import Router from 'vue-router'
import Panel from '@/components/panel_for_student'
import Panel_researcher from '@/components/panel_for_researcher'

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
    {
      path: '/researcher',
      name: 'Panel_researcher', // what is name for?
      component: Panel_researcher,
      props: {
         heading: '',
         unit_activity_type: 'challenge'
      },
    },
  ]
})

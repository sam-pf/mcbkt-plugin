import Vue from 'vue'
import Router from 'vue-router'
import Panel from '@/components/panel_for_student'
import Panel_research from '@/components/panel_for_research'

Vue.use (Router)

const common_props = {
  heading: '',
  unit_activity_type: 'challenge'
}

export default new Router ({
  mode: 'history',
  routes: [
    {
      path: '/research',
      name: 'panel_research',
      component: Panel_research,
      props: common_props,
    },
    {
      path: '/',
      name: 'panel',
      component: Panel,
      props: common_props,
    },
  ]
})

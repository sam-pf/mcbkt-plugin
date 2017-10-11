/**
 * @file This app is a data interactive plugin that mediates the MCBKT
 *    engine service to the CODAP data interactive such as Ramp Game.
 *
 * @copyright (c) 2017, Physics Front LLC (main@physicsfront.com)
 * @license <a href="https://www.apache.org/licenses/LICENSE-2.0">
 *    Apache License, Version 2.0</a> (also, see file NOTICE).
 * @author Sam Gweon (Sam@physicsfront.com)
 * @version 0.3.0
 */

// The entry point of webpack.
//
// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue ({
   el: '#app',
   router,
   template: '<App/>',
   components: { App },
   data: {
     version : '0.3.0'
   }
})

/**
 * @file This app is a data interactive plugin that mediates the MCBKT
 *    engine service to the CODAP data interactive such as Ramp Game.
 *
 * @copyright (c) 2017, Physics Front LLC (main@physicsfront.com)
 * @license <a href="https://www.apache.org/licenses/LICENSE-2.0">
 *    Apache License, Version 2.0</a> (also, see file NOTICE).
 * @author Sam Gweon (Sam@physicsfront.com)
 * @version 0.2.0
 */

// The entry point of webpack.
//
// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'

import post_logdata_for_mcbkt from './js-ext/mcbkt-client.js'
import iframe_phone from './js-ext/iframe-phone.js'
import logdata_listener from './js-ext/iframe-logdata-listener.js'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue ({
   el : '#app',
   router,
   template : '<App/>',
   components : { App },
   props : {
      applicaton: {
         type: String,
         default: 'CODAP',
      },
      activity: {
         type: String,
         default: 'Ramp Game 2017 09',
      },
      logdata_listener_name: {
         type: String,
         default: 'Real Time MCBKT',
      },
   },
   created : function () { // must be function, not =>
      this.ll = new logdata_listener (
         window.iframePhone ? window.iframePhone : iframe_phone,
         (logdata, callback) => { // eslint-disable-line no-unused-vars
            // console.log ("== main.js: posting logdata for mcbkt analysis: "
            //              + JSON.stringify (logdata))
            post_logdata_for_mcbkt (logdata)
            .then (
               data => {
                  // console.log ("== main.js: received data from UKDE: " +
                  //              data)
                  let d = JSON.parse (data)
                  if (d.answer && this.mcbkt_fit_consumer)
                     this.mcbkt_fit_consumer (d, window.top,
                           window.top.location, this.ll.get_state (false))
               },
               () => {}
            )
            .catch (() => {})
         },
         this.logdata_listener_name,
         {'application': this.application, 'activity': this.activity},
         0)
   }
})

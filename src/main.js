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

const APPLICATION = 'CODAP'
const ACTIVITY = 'Ramp Game 2017 09'
const LOGDATA_LISTENER_NAME = 'Real Time MCBKT'

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
   created : function () {

      // console.log ('** created: this = ' + JSON.stringify (this))
      // console.log ('** created: this.mcbkt_fit_consumer = ' +
      //             this.mcbkt_fit_consumer)

      this.ll = new logdata_listener (
         window.iframePhone ? window.iframePhone : iframe_phone,
         (logdata, callback) => { // eslint-disable-line no-unused-vars
            logdata.application = APPLICATION
            logdata.activity = ACTIVITY
            // console.log ("== main.js: posting logdata for mcbkt analysis: "
            //              + JSON.stringify (logdata))
            post_logdata_for_mcbkt (logdata)
            .then (
               data => {
                  // console.log ("== main.js: received data from UKDE: " +
                  //              data)
                  let d = JSON.parse (data)
                  // console.log ('** this = ' + JSON.stringify (this))
                  // console.log ('** this.mcbkt_fit_consumer = ' +
                  //             this.mcbkt_fit_consumer)
                  console.log ('** this.ll.get_state () = ' +
                               JSON.stringify (this.ll.get_state ()))
                  if (d.answer && this.mcbkt_fit_consumer)
                     this.mcbkt_fit_consumer (d, window.top,
                           window.top.location, this.ll.get_state ())
               },
               () => {}
            )
            .catch (() => {})
         },
         LOGDATA_LISTENER_NAME, 0)

   }
})

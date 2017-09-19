/**
 * @file This app is a data interactive plugin that mediates the MCBKT
 *    engine service to the CODAP data interactive such as Ramp Game.
 *
 * @copyright (c) 2017, Physics Front LLC (main@physicsfront.com)
 * @license <a href="https://www.apache.org/licenses/LICENSE-2.0">
 *    Apache License, Version 2.0</a> (also, see file NOTICE).
 * @author Sam Gweon (Sam@physicsfront.com)
 * @version 0.2.3
 */

// The entry point of webpack.
//
// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'

import iframe_phone from './js-ext/iframe-phone.js'
import logdata_listener from './js-ext/iframe-logdata-listener.js'
import post_logdata_for_mcbkt from './js-ext/mcbkt-client.js'

Vue.config.productionTip = false

function summarize_mcbkt_result (rv, mcbkt_ans, callback) {
   const new_doc = rv.new_doc || {}
   const cd = rv.cd || ""
   const sep = ';'
   let parts = [] // parts should not accept any sep containing string
   const id = new_doc.id // challenge level
   if (! id) return
   parts.push ('L=' + id)
   const scores = new_doc.iscores.join (',')
   if (! scores) return
   parts.push ('S=' + scores)
   const cluster_long = new_doc.cluster_long
   if (! cluster_long)
      return callback ({formatStr: parts.join (sep)})
   parts.push ('C=' + cluster_long)
   parts.push ('T=' + new_doc.time)
   let parvals = []
   for (const name of ['M', 'pli', 'pt', 'pg', 'ps'])
      try {
         const v = Math.round (mcbkt_ans [name][0] * 100)
         parvals.push ((isNaN (v) || v === undefined)? '?': v)
      } catch (e) {
         parvals = []
         break
      }
   if (parvals.length)
      parts.push ('M+=' + parvals.join (','))
   try {
      parts.push ('D=' + mcbkt_ans ['fit_duration'].toFixed (1))
   } catch (e) {} // eslint-disable-line no-empty
   callback ({formatStr: parts.join (sep)})
   return cd
}

/* eslint-disable no-new */
new Vue ({
   el : '#app',
   router,
   template : '<App/>',
   components : { App },
   props : {
      application: {
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
            post_logdata_for_mcbkt (logdata, this.ll.get_state (false))
            .then (
               data => {
                  // console.log ("== main.js: received data from UKDE: " +
                  //              data)
                  let d = JSON.parse (data)
                  if (d.answer)
                     if (this.mcbkt_fit_consumer) {
                        const cd = summarize_mcbkt_result (
                           this.mcbkt_fit_consumer (d), d.answer, callback)
                        if (cd)
                           this.ll.update_title ('RT-MCBKT-' + cd)
                     }
               },
               reason => {
                  console.error ("** E: promise rejected.", reason)
               }
            )
            .catch (
               error => {
                  console.error ("** E: error while processing promise.",
                                 error)
               }
            )
         },
         this.logdata_listener_name,
         {'application': this.application, 'activity': this.activity},
         false,
         0)
   }
})

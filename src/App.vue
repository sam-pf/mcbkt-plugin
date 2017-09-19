<template>
  <div id="app">
    <div id="app-innerframe">
      <router-view @cd_changed="cd_changed_cb"></router-view>
    </div>
  </div>
</template>

<script>

import iframe_phone from './js-ext/iframe-phone.js'
import logdata_listener from './js-ext/iframe-logdata-listener.js'
import post_logdata_for_mcbkt from './js-ext/mcbkt-client.js'

function summarize_mcbkt_result (rv, mcbkt_ans, callback) { // <<<
   const new_doc = rv.new_doc || {}
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
   return callback ({formatStr: parts.join (sep)})
}
// >>>

export default {
   name: 'app',
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
   methods : {
      cd_changed_cb: function (cd) {
         this.ll.update_title ('rt-MCBKT-' +  cd)
      }
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
                        summarize_mcbkt_result (
                           this.mcbkt_fit_consumer (d), d.answer, callback)
                        // if (cd)
                        //   this.ll.update_title ('RT-MCBKT-' + cd)
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
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
  margin-bottom: 5px;
}
#app-innerframe {
  display: inline-block;
}
</style>

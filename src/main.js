// The entry point of webpack.
//
// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// <<< window.iframePhone, window.logdataListener
//
// Also, these two globals are made available as (Vue instance).$iframePhone
// and (Vue instance).$logdataListener.  However, it remains to be seen how
// Vue instance can be conveniently access in (or around) a single vue file
// that defines a component (maybe Vue.extend is relevant?).

import iframe_phone_module from './js-ext/iframe-phone.js'
if (! window.iframePhone) {
   if (! iframe_phone_module)
      throw Error ('Failed to load module "iframePhone".')
   window.iframePhone = iframe_phone_module
}
Object.defineProperty (Vue.prototype, '$iframePhone',
                       { value: window.iframePhone })

import logdata_listener from './js/iframe-logdata-listener.js'
window.logdataListener = new logdata_listener (window.iframePhone,
   (logdata, callback) => {
      let logdata_str = JSON.stringify (logdata)
      console.log ("== main.js: got logdata: " + logdata_str)
      if ( logdata_str.match (/starscore/i) )
         callback ({'formatStr': 'test', 'MCBKT-result': 'coming soon'})
   })
Object.defineProperty (Vue.prototype, '$logdataListener',
                       { value: window.logdataListener })

// >>>

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue ({
   el : '#app',
   router,
   template : '<App/>',
   components : { App }
})

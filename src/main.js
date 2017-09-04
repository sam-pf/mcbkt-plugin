// The entry point of webpack.
//
// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// <<< window.iframePhone, (Vue instance).$iframePhone
// While (Vue instance).$iframePhone is sometimes a recommended method from
// the web, it seems hard to get access to it in a single file component
// paradigm (maybe Vue.extend will do it?).

import iframe_phone_module from './js/iframe-phone.js'
if ( ! iframe_phone_module && ! window.iframePhone )
  throw Error ('Failed to load module "iframePhone".')
if ( ! window.iframePhone )
  window.iframePhone = iframe_phone_module
Object.defineProperty (Vue.prototype, '$iframePhone',
                       { value: iframe_phone_module })

// >>>
// <<< window.iframePhoneManager, (Vue instance).$iframePhoneManager
// While (Vue instance).$iframePhone is sometimes a recommended method from
// the web, it seems hard to get access to it in a single file component
// paradigm (maybe Vue.extend will do it?).

var iframePhoneManager = function () {

// Here, dataManager and dispatcher are simplified and modified versions of
// the two Objects in "DataflowGettingStarted" by Doug Martin and Jonthan
// Sandoe.
var dataManager = { // <<<

  state: null,

  init: function () {
    this.listeners = []
    this.attributes = []
    this.state = {
      title: "Getting Started with Dataflow",
      version: "0.1",
      dimensions: { width: 450, height: 400 },
      connectionState: null,
    }
    return this
  },

  register: function (listener) {
    this.listeners = this.listeners || [];
    this.listeners.push(listener);
    listener.setState(this.state);
  },

  unregister: function (listener) {
    this.listeners = this.listeners || [];
    console.log ('** unregistering listener:' + listener)
    var ix = this.listeners.indexOf(listener);
    if (ix >= 0) {
      this.listeners.splice(ix, 1);
      console.log ('** unregistered listener:' + listener)
    }
    console.log ('** (maybe) unregistered listener:' + listener)
    dispatcher.destroy ();
  },

  notify: function () {
    this.listeners.forEach (function (listener) {
      listener.setState (this.state);
    }.bind (this));
  },

  setInteractiveFrame: function (frameData) {
    if (frameData.dimensions) {
      this.state.dimensions = frameData.dimensions;
    }
    if (frameData.title) {
      this.state.title = frameData.title;
    }
    if (frameData.savedState) {
      Object.assign(this.state, frameData.savedState);
    }
    dispatcher.sendRequest ({
      action: 'update',
      resource: 'interactiveFrame',
      values: {
        title: 'Real Time MCBKT',
        version: this.state.version,
        preventBringToFront: false,
        dimensions: this.state.dimensions
      }
    });
  },

  getPersistentState: function () {
    return {
    };
  },

  logMessageNotice: function (values) {
    console.log ('** logMessageNotice: values = ' + JSON.stringify (values))
    var currentTopic = this.currentTopic();

    // when not showing a popup only check the current topic
    if (!this.state.showPopup) {
      if (values.topic === currentTopic.name) {
        currentTopic.logged = true;
        this.setState ({
          showPopup: true
        });
      }
      return;
    }

  },

  setState: function (newState) {
    var self = this;
    Object.keys(newState).forEach(function (key) {
      self.state[key] = newState[key];
    });

    this.notify();
  },

  getState: function () {
    return this.state;
  }

}.init();
// >>>
var dispatcher = { // <<<

  init: function () {
    this.clientId = 'RTMCBKT' + Math.round (10000000000000 * Math.random ())
    this.connection = new window.iframePhone.IframePhoneRpcEndpoint (
      this.handleCODAPRequest, "data-interactive", window.parent)
    this.connectionState = null
    this.sendRequest ({
      action : "get",
      resource : "interactiveFrame"
    })
    this.sendRequest ({
      action : "register",
      resource : "logMessageMonitor",
      values : {
        clientId : this.clientId,
        message : "*",
      }
    })
    window.onunload = this.destroy.bind (this)
    return this
  },

  destroy : function () {
    this.sendRequest ({
      action : "unregister",
      resource : "logMessageMonitor",
      values : { clientId : this.clientId }
    })
    this.connection.disconnect ()
  },

  handleCODAPRequest : function (request, callback) {
    console.log ('** handleCODAPRequest: ' + JSON.stringify (request))
    function getResourceType (resourceSelector) {
      return resourceSelector && resourceSelector.match (/^[^[]*/)[0]
    }
    var resourceType = getResourceType (request.resource)
    var success = false
    var values = null
    switch (resourceType) {
      case 'interactiveState':
        if (request.action === 'get') {
          success = true
          values = dataManager.getPersistentState ()
        }
        break
      case 'logMessageNotice':
        if (request.action === 'notify') {
          success = true;
          dataManager.logMessageNotice (request.values)
        }
        break
      default:
        console.log ('Unsupported request from CODAP to DI: ' +
                     JSON.stringify (request))
    }
    callback ({success: success, values: values})
  },

  sendRequest : function (request, handlingOptions, handler) {
    handler = handler || this.handleResponse.bind (this)
    this.connection.call (request, function (response) {
      handler(request, response, handlingOptions)
    }.bind (this))
  },

  parseResourceSelector : function (iResource) {
    console.log ('Got resource selector string = ' + iResource)
    var selectorRE = /([A-Za-z0-9_-]+)\[([^\]]+)]/
    var result = {}
    var selectors = iResource.split ('.')
    selectors.forEach (function (selector) {
      var resourceType, resourceName
      var match = selectorRE.exec (selector)
      if (selectorRE.test (selector)) {
        resourceType = match [1]
        resourceName = match [2]
        result [resourceType] = resourceName
        result.type = resourceType
      } else
        result.type = selector
    })
    return result
  },

  handleResponse: function (request, result, handlingOptions) {
    function handleOneResponse (iRequest, iResult, iResourceType) { // <<<
      if (! iResult.success) {
        console.log ('Request to CODAP Failed: ' + JSON.stringify (request))
        alert ('** Request to CODAP Failed: ' + JSON.stringify (request))
      } else {
        alert ('== Request to CODAP succeeded: ' + JSON.stringify (request))
        if (request.action === 'get') {
          switch (iResourceType) {
            case 'interactiveFrame':
              dataManager.setInteractiveFrame (iResult.values)
              if (iResult.values.savedState)
                dataManager.setState(iResult.values.savedState)
              break
          }
        }
      }
    } // >>>
    var resourceObj
    var STARTING_CONNECTION_STATE = this.connectionState

    if (! result) {
      console.log('Request to CODAP timed out: ' + JSON.stringify(request));
      this.connectionState = TIMEDOUT_CONNECTION_STATE;
    } else if (Array.isArray (result)) {
      this.connectionState = ACTIVE_CONNECTION_STATE;
      request.forEach (function (rq, rqix) {
        resourceObj  = this.parseResourceSelector (rq.resource)
        handleOneResponse (rq, result [rqix], resourceObj.type)
      }.bind (this))
    } else {
      this.connectionState = ACTIVE_CONNECTION_STATE;
      resourceObj  = this.parseResourceSelector (request.resource)
      handleOneResponse (request, result, resourceObj.type)
    }
    if (STARTING_CONNECTION_STATE !== this.connectionState) {
      dataManager.setState ({connectionState: this.connectionState});
    }
  }
}.init();
// >>>

  return {
    dataManager: dataManager,
    dispatcher: dispatcher,
  }

}()

window.iframePhoneManager = iframePhoneManager
Object.defineProperty (Vue.prototype, '$iframePhoneManager',
                       { value: iframePhoneManager })

// >>>

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue ({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

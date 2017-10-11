<template>
  <div id="app" :version="version">
    <div id="app-innerframe">
      <router-view @cd_changed="cd_changed_cb"></router-view>
    </div>
  </div>
</template>

<script>


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

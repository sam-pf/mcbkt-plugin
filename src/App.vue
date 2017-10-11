<template>
  <div id="app">
    <div id="app-innerframe">
      <router-view></router-view>
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
      version: {
         type: String,
         default: '--uknown-version--',
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

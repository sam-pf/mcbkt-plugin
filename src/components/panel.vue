<!-- <<< template block -->
<template>
  <div class="mcbkt-panel">
    <h1>{{ heading | capitalize_all }}</h1>
    <h2>Current {{ unit_activity_type | capitalize }}</h2>
    <map_table_h :data="curitems"> </map_table_h>
    <h2>Previous {{ unit_activity_type | capitalize | pluralize }}</h2>
    <map_table_h :data="previtems"> </map_table_h>
    <h2>All {{ unit_activity_type | capitalize | pluralize }}</h2>
    <map_table_h :data="allitems"> </map_table_h>
  </div>
</template>
<!-- >>> template block -->
<!-- <<< script block -->
<script>
import Pluralize from 'pluralize'
import MapTableH from './map_table_h.vue'

function _capitalize (val) {
  return val.charAt (0).toUpperCase () + val.slice (1)
}

export default {
  name: 'mckbt-panel',
  components: {
    'map_table_h': MapTableH,
  },
  props: {
    unit_activity_type: {
      default: 'level',
      type: String,
    },
    heading: {
      default: 'Real time MCBKT',
      type: String,
    },
  },
  data () {
    return {
      curitems: [
        ['id'],
        ['cluster', 'A'],
        ['passed?', 'n'],
        ['time', 30],
        ['npts', 20]
      ],
      previtems: [
        ['ids', [1,2]],
        ['clusters', ['B','C']],
        ['passed?', ['y', 'n']],
        ['times', [720, 300]],
        ['npts', [30, 30]],
      ],
      allitems: [
        ['time', 1050],
        ['npts', 80],
        ['passed', [1]],
      ],
    }
  },
  methods: {
    register_logdata_listener () {
    },
    unregister_logdata_listener () {
    },
    register_mcbkt_client (logdata_provider) {
    },
    unregister_mcbkt_client (logdata_provider) {
    },
  },
  filters: {
    capitalize: _capitalize,
    pluralize: val => Pluralize (val, 10),
    capitalize_all: val => val.split (" ").map (_capitalize).join (" "),
  }
}
</script>
<!-- >>> script block -->
 <!-- <<< style block, scoped -->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mcbkt-panel {
  font-size: 15px;
}

h1, h2 {
  font-weight: normal;
  -webkit-margin-before: 0.1em;
  -webkit-margin-after: 0.1em;
  margin-top: 0.1em;
  margin-bottom: 0.1em;
  padding-top: 0px;
  padding-bottom: 0px;
}

a {
  color: #42b983;
}
</style>
<!-- >>> style block, scoped -->

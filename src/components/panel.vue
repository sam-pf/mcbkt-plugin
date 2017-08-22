<!-- <<< template block -->
<template>
  <div class="mcbkt-panel">
    <h1>{{ heading | capitalize_all }}</h1>
    <h2>Current {{ unit_activity_type | capitalize }}</h2>
    <map_table_h> </map_table_h>
    <h2>Previous {{ unit_activity_type | capitalize | pluralize }}</h2>
    <map_table_h> </map_table_h>
    <h2>All {{ unit_activity_type | capitalize | pluralize }}</h2>
    <map_table_h> </map_table_h>
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

var _field_descr = {
  npts: 'Number of Points',
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
      default: 'Real time MCBKT analysis',
      type: String,
    },
    cur_rec: {
      type: Array,
      default: function () {
        return ['id', 'cluster', 'mastered', 'time', 'npts']
      }
    },
    prev_rec: {
      type: Array,
      default: function () {
        return ['ids', 'clusters', 'mastereds', 'times', 'nptss']
      }
    },
    all_rec: {
      type: Array,
      default: function () {
        return ['time', 'npts', 'mastereds']
      }
    }
  },
  data () {
    return {
      curitems: [
        { name: "x", value: 1 },
        { name: "y", value: 2 },
      ],
      pastitems: [
        { name: "xx", value: 11 },
        { name: "yy", value: 22 },
      ],
      allitems: [
        { name: "AA", value: 110 },
        { name: "BB", value: 220 },
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
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
<!-- >>> style block, scoped -->

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
    curitem_keys: {
      default: function () {
        return ['id', 'cluster', 'time', 'npts'] // 'passed?'
      },
      type: Array
    },
    allitems_keys: {
      default: function () {
        return ['time', 'npts']
      },
      type: Array
    }
  },
  data () {
    return {
      all_data: [ // "just for demo": will be deleted on creation (see below)
        {'id': 1, 'cluster': 'A', 'time': 30, 'npts': 5},
        {'id': 2, 'cluster': 'B', 'time': 50, 'npts': 10},
        {'id': 3, 'cluster': 'C', 'time': 100, 'npts': 10}
      ]
    }
  },
  computed: {
    curitems: {
      get: function () {
        const d = this.all_data
        const keys = this.curitem_keys
        var ans = []
        if (d.length) {
          const m = d [d.length - 1]
          for (const key of keys)
            ans.push ([key, m [key] || ''])
        } else {
          for (const key of keys)
            ans.push ([key, ''])
        }
        return ans
      },
      set: function () {}
    },
    previtems: {
      get: function () {
        const d = this.all_data
        const keys = this.curitem_keys
        var ans = []
        for (const key of keys) {
          let a = []
          for (let i = 0; i < d.length - 1; i++)
            a.push (d [i][key])
          ans.push ([key + (key.endsWith ('s')?'': 's'), a])
        }
        return ans
      },
      set: function () {}
    },
    allitems: {
      get: function () {
        const d = this.all_data
        const keys = this.allitems_keys
        var ans = []
        for (const key of keys) {
          let s = 0
          for (let i = 0; i < d.length; i++)
            s += d [i][key]
          ans.push ([key + (key.endsWith ('s')?'': 's'), s? s: ""])
        }
        return ans
      },
      set: function () {}
    }
  },
  created () {
    this.all_data = []
    window.mcbkt_fit_consumer = data => {
      const times = data.times
      console.log ('times = ' + JSON.stringify (times))
      const cluster = data.cluster
      console.log ('cluster = ' + cluster)
      const reffv_list = data.reffv_list
      console.log ('reffv_list = ' + JSON.stringify (reffv_list))
      // TODO: do a better job of timing?  3 is an estimated "play time"
      const npts = times.length
      console.log ('npts = ' + npts)
      const time = Math.round (times [npts - 1] - times [0] + 3)
      console.log ('time = ' + time)
      const id = reffv_list [reffv_list.length - 1]
      console.log ('id = ' + id)
      console.log ('this.all_data = ' + JSON.stringify (this.all_data))
      let prev_reffv_list = []
      for (const m of this.all_data)
        prev_reffv_list.push (m.id)
      console.log ('prev_reffv_list = ' + JSON.stringify (prev_reffv_list))
      let old_data
      if (reffv_list == prev_reffv_list)
        old_data = this.all_data.slice (0, this.all_data.length - 1)
      else
        old_data = this.all_data
      this.all_data = old_data.concat ({'id': id, 'cluster': cluster,
          'time': time, 'npts': npts})
    }
  },
  methods: {
    // no methods have been found necessary just yet...
    add_new_data () {
    },
    replace_last_data () {
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

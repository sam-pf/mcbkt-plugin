<!-- <<< template block -->
<template>
  <div class="mcbkt-panel">
    <p class="explain_cluster">{{ body_tooltip_cur_plus }}<br>
    <span class=scores>{{ scores }}</span></p>
    <h1>{{ heading | capitalize_all }}</h1>
    <h2 class='curact'>Current {{ unit_activity_type | capitalize }}</h2>
    <map_table_h :data="curitems" :body_tooltip="body_tooltip_cur">
    </map_table_h>
    <h2 class='preact'>
      Previous {{ unit_activity_type | capitalize | pluralize }}</h2>
    <map_table_h :data="previtems"> </map_table_h>
    <h2 class='allact'>All {{ unit_activity_type | capitalize | pluralize }}
      </h2>
    <map_table_h :data="allitems"> </map_table_h>
  </div>
</template>
<!-- >>> template block -->
<!-- <<< script block -->
<script>
import Pluralize from 'pluralize'
import MapTableH from './map_table_h.vue'
import mcbkt_consumer_panel from './mcbkt_consumer_panel_mixin'

function _capitalize (val) {
  return val.charAt (0).toUpperCase () + val.slice (1)
}

export default {
  name: 'mckbt-panel',
  mixins: [mcbkt_consumer_panel],
  components: {
    'map_table_h': MapTableH,
  },
  props: {
    height: {
      type: Number,
      default: 400,
    },
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
  computed: {
    body_tooltip_cur: {
      get: function () {
        let d = this.all_data
        if (! d || ! d.length) return ''
        d = d [d.length - 1]
        const prefix = d.cluster_long ? d.cluster_long : d.cluster
        if (d.cluster_desc)
          return prefix + ':' + d.cluster_desc
        else
          return prefix
      },
      set: function () {}
    },
    body_tooltip_cur_plus: {
      get: function () {
        const btc = this.body_tooltip_cur.trim ()
        if (! btc.length) return ''
        return 'Cluster ' + btc
      },
      set: function () {}
    },
    scores: {
      get: function () {
        const d = this.all_data
        if (! d || ! d.length) return ''
        const ans = d [d.length - 1].iscores.join (',')
        if (! ans.length) return ans
        return 'Scores:' + ans
      },
      set: function () {}
    },
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
          ans.push ([key, s? s: ""])
        }
        return ans
      },
      set: function () {}
    }
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

.explain_cluster {
  max-width: 330px;
  padding: 10px;
  background-color: #b4d497;
  font-size: 1.2em;
}

.curact {
  color: blue;
}

.preact {
  color: tomato;
}

.allact {
  color: purple;
}

a {
  color: #42b983;
}
</style>
<!-- >>> style block, scoped -->

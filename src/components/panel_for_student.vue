<!-- <<< template block -->
<template>
  <div class="mcbkt-panel">
    <p class="scores_heading">{{ scores_heading }}</p>
    <p class="scores">{{ scores }}</p>
    <p class="cluster_diagnostic">{{ cluster_diagnostic }}</p>
  </div>
</template>
<!-- >>> template block -->
<!-- <<< script block -->
<script>
import Pluralize from 'pluralize'

function _capitalize (val) {
  return val.charAt (0).toUpperCase () + val.slice (1)
}

export default {
  name: 'mckbt-panel',
  data () {
    return {
      all_data: [],
    }
  },
  props: {
    unit_activity_type: {
      default: 'level',
      type: String,
    },
  },
  computed: {
    curlevel: {
      get: function () {
        const d = this.all_data
        if (! d) return ''
        if (d.length)
          return d [d.length - 1].id
        return ''
      },
      set: function () {}
    },
    scores_heading: {
      get: function () {
        const d = this.all_data
        if (! d) return 'Scores'
        if (d.length)
          return 'Scores for ' + _capitalize (this.unit_activity_type) +
            d [d.length - 1].id
        return 'Scores'
      },
      set: function () {}
    },
    scores: {
      get: function () {
        const d = this.all_data
        let iscores
        if (! d) return ''
        if (d.length)
          iscores = d [d.length - 1].iscores
        if (iscores) return iscores.join (', ')
        return ''
      },
      set: function () {}
    },
    cluster_diagnostic: {
      get: function () {
        const d = this.all_data
        let desc
        if (! d) return ''
        if (d.length)
          desc = d [d.length - 1].cluster_desc
        if (desc) {
          const cluster = d [d.length - 1].cluster
          if (cluster === 'A' || cluster === 'B' || cluster === 'E')
            desc = '! ' + desc
          return desc
        }
        return ''
      },
      set: function () {}
    },
  },
  created () {
    this.all_data = []
    this.$root.mcbkt_fit_consumer = data => {
      const norm_scores = data.norm_scores || []
      const times = data.times || []
      const cluster = data.cluster || ''
      const reffv_list = data.reffv_list || []
      const npts = times.length
      // TODO: do a better job of timing?  3 is an estimated "play time"
      const time = npts? Math.round (times [npts - 1] - times [0] + 3) : ''
      const id = reffv_list.length? reffv_list [reffv_list.length - 1] : ''
      let prev_reffv_list = []
      for (const m of this.all_data)
        prev_reffv_list.push (m.id)
      const cluster_long = data.cluster_long || ''
      const cluster_desc = data.cluster_description || ''
      let old_data
      if (reffv_list.join (',') === prev_reffv_list.join (','))
        old_data = this.all_data.slice (0, this.all_data.length - 1)
      else
        old_data = this.all_data
      let iscores = []
      for (const s of norm_scores)
        iscores.push (Math.round (s * 100))
      this.all_data = old_data.concat ({id, cluster, time, npts, iscores,
        cluster_long, cluster_desc})
    }
  },
  methods: {
    // no methods have been found necessary just yet...  so these methods are
    // just blank place holders for now.
    add_new_data () {
    },
    unregister_logdata_listener () {
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
  font-size: 14px;
  max-width: 330px;
}

.p {
  -webkit-margin-before: 3px;
  -webkit-margin-after: 3px;
  margin: 3px 0px;
}

.scores_heading {
  font-size: 1.2em;
  font-weight: bold;
}

.scores {
  color: tomato;
}

.cluster_diagnostic {
  color: #ddd;
}

a {
  color: #42b983;
}
</style>
<!-- >>> style block, scoped -->

<!-- <<< template block -->
<template>
  <div class="mcbkt-panel">
    <p class="scores_heading">{{ scores_heading }}</p>
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
      _prev_cd: '',
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
        return 'This window, RTMCBKT-' + this.cluster_diagnostic +
          ', should remain open <i>at all times</i>.'
      },
      set: function () {}
    },
    scores: {
      get: function () { return '' },
      set: function () {}
    },
    cluster_diagnostic: {
      get: function () {
        const d = this.all_data
        let desc
        let rv
        const faker = 'd2dac'
        rv = faker
        if (d) {
          if (d.length)
            desc = d [d.length - 1].cluster_long
          if (desc)
            rv = ('c' + this.curlevel + 'ca' + desc).toLowerCase ()
        }
        if (rv != this._prev_cd)
          this.$emit ('cd_changed', rv)
        return rv
      },
      set: function () {}
    },
  },
  created () {
    this.all_data = []
    this.$parent.mcbkt_fit_consumer = data => {
      const norm_scores = data.norm_scores || []
      const times = data.times || []
      const cluster = data.cluster || ''
      const reffv_list = data.reffv_list || []
      let npts = times.length
      if (npts != norm_scores.length) {
        console.warn ("** W: length mismatch between times and scores?!")
        if (norm_scores.length < npts)
          npts = norm_scores.length
      }
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
      const new_doc = {id, cluster, time, iscores, cluster_long, cluster_desc}
      this.all_data = old_data.concat (new_doc)
      return {new_doc, cd: this.cluster_diagnostic}
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
  font-size: 15px;
  max-width: 330px;
}

p {
  -webkit-margin-before: 3px;
  -webkit-margin-after: 3px;
  margin: 3px 0px;
}

.scores_heading {
  color: #4886ad;
  color: black;
  font-size: 1.2em;
  font-weight: normal;
}

.scores {
  font-size: 1.5em;
  color: #e2551b;
  font-weight: bold;
}

span .cluster_diagnostic {
  margin-left: 15px;
}

.cluster_diagnostic {
  font-size: 0.9em;
  font-weight: normal;
  color: #bbb;
}

a {
  color: #42b983;
}
</style>
<!-- >>> style block, scoped -->

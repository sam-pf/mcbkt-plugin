<!-- <<< template block -->
<template>
  <div class="mcbkt-panel">
    <p class="message">This window, rt-MCBKT-{{ cluster_diagnostic }},
      must remain open <i>at all times</i>.</p>
  </div>
</template>
<!-- >>> template block -->
<!-- <<< script block -->
<script>

import mcbkt_consumer_panel from './mcbkt_consumer_panel_mixin'

export default {
  name: 'mckbt-panel',
  mixins: [mcbkt_consumer_panel],
  data () {
    return {
      width: 335,
      height: 90,
      _prev_cd: '',
    }
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
        if (rv != this._prev_cd) {
          this.$emit ('cd_changed', rv)
          this._prev_cd = rv
        }
        return rv
      },
      set: function () {}
    },
  },
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

.message {
  color: #888;
  font-size: 14px;
  font-weight: normal;
}
</style>
<!-- >>> style block, scoped -->

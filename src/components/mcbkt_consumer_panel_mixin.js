// This mixin manages data "all_data, ll, mcbkt_fit_consumer".
// It uses data "width, height".
// It also calls this.post_mcbkt_fit_consumer_hook, if defined.

import iframe_phone from '@/js-ext/iframe-phone.js'
import logdata_listener from '@/js-ext/iframe-logdata-listener.js'
import post_logdata_for_mcbkt from '@/js-ext/mcbkt-client.js'

function summarize_mcbkt_result (rv, mcbkt_ans, callback) { // <<<
   const new_doc = rv.new_doc || {}
   const sep = ';'
   let parts = [] // parts should not accept any sep containing string
   const id = new_doc.id // challenge level
   if (! id) return
   parts.push ('L=' + id)
   const scores = new_doc.iscores.join (',')
   if (! scores) return
   parts.push ('S=' + scores)
   const cluster_long = new_doc.cluster_long
   if (! cluster_long)
      return callback ({formatStr: parts.join (sep)})
   parts.push ('C=' + cluster_long)
   parts.push ('T=' + new_doc.time)
   let parvals = []
   for (const name of ['M', 'pli', 'pt', 'pg', 'ps'])
      try {
         const v = Math.round (mcbkt_ans [name][0] * 100)
         parvals.push ((isNaN (v) || v === undefined)? '?': v)
      } catch (e) {
         parvals = []
         break
      }
   if (parvals.length)
      parts.push ('M+=' + parvals.join (','))
   try {
      parts.push ('D=' + mcbkt_ans ['fit_duration'].toFixed (1))
   } catch (e) {} // eslint-disable-line no-empty
   return callback ({formatStr: parts.join (sep)})
}
// >>>

export default {
  data () {
    return {
      width: 335,
      height: 90,
    }
  },
  created: function () {
    this.all_data = []
    this.mcbkt_fit_consumer = data => {
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
      if (this.post_mcbkt_fit_consumer_hook) // just in case
        this.post_mcbkt_fit_consumer_hook ()
      return new_doc
    }
    console.log ('this.mcbkt_fit_consumer = ' + this.mcbkt_fit_consumer)
    this.ll = new logdata_listener (
      window.iframePhone ? window.iframePhone : iframe_phone,
      (logdata, callback) => {
        console.log ("== mcbkt_consumer_panel: posting logdata for mcbkt " +
                     "analysis: " + JSON.stringify (logdata))
        post_logdata_for_mcbkt (logdata, this.ll.get_state (false))
        .then (
          data => {
            // console.log ("== main.js: received data from UKDE: " +
            //              data)
            let d = JSON.parse (data)
            if (d.answer && this.mcbkt_fit_consumer)
              summarize_mcbkt_result (this.mcbkt_fit_consumer (d),
                d.answer, callback)
          },
          reason => { console.error ("** E: promise rejected.", reason) }
        )
        .catch (
          error => {
            console.error ("** E: error while processing promise.", error)
          }
        )
      },
      {
        title: this.$parent.logdata_listener_name,
        version: this.$parent.version,
        dimensions: { width: this.width, height: this.height },
        more_logdatum_fields: {
          'application': this.$parent.application,
          'activity': this.$parent.activity
        },
        block_boomerang: false,
        verbosity: 0
      }
    )
    console.log ('this.ll = ' + this.ll)
  }
}

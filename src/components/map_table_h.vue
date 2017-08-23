<!-- <<< template block -->
<template>
  <table class="table map_table_h">
    <thead>
      <tr>
        <th v-for="key in keys">{{ '' + key }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="val in vals">{{ '' + val }}</td>
      </tr>
    </tbody>
  </table>
</template>
<!-- >>> template block -->
<!-- <<< script block -->
<script>
export default {
  name: 'map_table_h',
  props: {
    data: {
      type: null,
      default: function () {
        return [['key 1', 'value 1'], ['key 2', 'value 2'], ['k3', 'val 3']]
      },
      validator: function (val) {
        if ( val [Symbol.iterator] == undefined ) {
          console.log ('data must be an iterable.')
          return false
        }
        // Micro-check instance of common repeatable iterable.  Map needs no
        // checking at all.
        if ( val instanceof Array || val instanceof Set ) {
          let v, _k, _v, _rest, e, ok = true
          for (v of val) { // Repeatable iterable---safe to iterate over.
            try {
              [_k, _v, ..._rest] = v
              if (_rest.length) ok = false
              else if ( _v == undefined || _k == undefined ) ok = false
            } catch (e) {
              ok = false
            }
            if ( ! ok ) break
          }
          if ( ! ok ) {
            console.log ('** Data validation failed for element "' + v + '".')
            return false
          }
        }
        return true
      },
    },
  },
  data () {
    return {
    }
  },
  computed: {
    map: function () {
      return new Map (this.data)
    },
    keys: function () {
      return Array.from (this.map.keys ()).map (x => '' + x)
    },
    vals: function () {
      return Array.from (this.map.values ()).map (x=> '' + x)
    },
  },
}
</script>
<!-- >>> script block -->
<!-- <<< style block, scoped -->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  display: inline-block;
}

th {
  font-size: 130%;
}

th, td {
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
}

a {
  color: #42b983;
}
</style>
<!-- >>> style block, scoped -->

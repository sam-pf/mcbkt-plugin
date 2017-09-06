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
        return [['key 1', 'value 1'], ['key 2', 'value 2'], ['k3']]
      },
      validator: function (val) {
        if ( val [Symbol.iterator] == undefined ) {
          console.log ('data must be an iterable.')
          return false
        }
        // Detailed checkes on Set or Array data: deleted (unnecessary, I
        // think) on 08-25-2017.
        return true
      },
    },
  },
  data () { return {} },
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
  border-spacing: 0px 2px;
}

th, td {
  padding: 2px 10px;
  text-align: center;
}

th {
  font-size: 120%;
}

td {
  font-size: 110%;
}

th:nth-child(even) {
  background: #e5ebff;
}

th:nth-child(odd) {
  background: #f1ece9;
}

a {
  color: #42b983;
}
</style>
<!-- >>> style block, scoped -->

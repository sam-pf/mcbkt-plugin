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
      type: Array,
      default: function () {
        return [['key 1', 'value 1'], ['key 2', 'value 2']]
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

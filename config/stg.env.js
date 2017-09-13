var merge = require('webpack-merge')
var proEnv = require('./pro.env')

module.exports = merge(proEnv, {
  NODE_ENV: '"production_stg"'
})

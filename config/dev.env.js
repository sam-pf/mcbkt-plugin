var merge = require('webpack-merge')
var stgEnv = require('./stg.env')

module.exports = merge(stgEnv, {
  NODE_ENV: '"development"'
})

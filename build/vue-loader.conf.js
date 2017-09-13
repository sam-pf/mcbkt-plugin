var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV == 'production'
var isStaging = process.env.NODE_ENV == 'production_stg'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isStaging
      ? config.build.productionSourceMap : ( isProduction
      ? config.buildpro.productionSourceMap
      : config.dev.cssSourceMap ),
    extract: isProduction || isStaging
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}

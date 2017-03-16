const startApi = require('../../lib/api')

const routes = require('./routes')
const services = require('./services')
const middlewares = require('./middlewares')

module.exports = config => startApi({
  config,
  routes,
  services,
  middlewares,
})

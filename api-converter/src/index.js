const startApi = require('../../lib/api')

const routes = require('./routes')
const services = require('./services')

module.exports = config => startApi({
  config,
  routes,
  services,
})

const bodyParser = require('body-parser')

const startApi = require('../../lib/api')

const routes = require('./routes')
const services = require('./services')

module.exports = config => startApi({
  config,
  routes,
  services,
  middlewares: [
    bodyParser.json({type: 'application/json'}),
    (req, res, next) => {
      console.log('HEY!')
      next()
    },
  ],
})

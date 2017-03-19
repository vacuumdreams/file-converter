const actions = require('./actions')
const presentation = require('./presentation')
const routes = require('./routes')
const state = require('./state')

module.exports = {
  name: 'app',
  actions,
  presentation,
  routes,
  state,
}

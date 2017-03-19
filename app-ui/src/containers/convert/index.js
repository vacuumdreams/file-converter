const actions = require('./actions')
const presentation = require('./presentation')
const state = require('./state')

module.exports = {
  name: 'app.convert',
  template: 'convert.html',
  actions,
  presentation,
  state,
}

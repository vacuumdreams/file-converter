const actions = require('./actions')
const state = require('./state')
const views = require('./views')

module.exports = {
  name: 'app.convert',
  template: 'convert.html',
  actions,
  state,
  views,
}

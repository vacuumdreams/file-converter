const bodyParser = require('body-parser')

module.exports = () => ([
  bodyParser.json({ type: 'application/json' }),
])

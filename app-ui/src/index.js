const app = require('../../lib/app')

const main = require('./app')
const containers = require('./containers')

app({ main, containers })

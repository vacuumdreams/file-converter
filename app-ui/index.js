const config = require('./config')
const express = require('express')
const path = require('path')

const startServer = require('../lib/api')

startServer({
  config, 
  routes: () => ([]), 
  middlewares: () => ([
    express.static(path.join(__dirname, 'dist')),
    express.static(path.join(__dirname, '..', 'node_modules/angular')),
  ]),
})

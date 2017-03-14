const config = require("./config")
const express = require("express")
const path = require("path")

const bootstrapServer = require("../lib/api")

bootstrapServer(config, [], server => {
  server.use(express.static(path.join(__dirname, "dist")))
})

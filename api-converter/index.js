"use strict"

const config = require("./config")
const bootstrapApi = require("../lib/api")

const PROCESSTIME = {
  HTML: 10000,
  PDF: 10,
}

const STEPS = 100

const process = (time, res) => {
  let track = 0
  const progress = setInterval(() => {
    res.write(`${track++}`)
    console.log(track)
    if (track === STEPS) {
      clearInterval(progress)
      res.end()
    }
  }, time / STEPS)
}

const routeSpec = {
  "/to-html": {
    post: (req, res) => process(PROCESSTIME.HTML, res),
  },
  "/to-pdf": {
    post: (req, res) => process(PROCESSTIME.PDF, res),
  },
}

bootstrapApi(config, routeSpec, () => {})

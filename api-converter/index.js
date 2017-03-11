"use strict"

const config = require("./config")
const bootstrapApi = require("../lib/api")

const PROCESSTIME = {
  HTML: 10000,
  PDF: 10,
}

const STEPS = 100

const routeSpec = {
  "/to-html": {
    post: (req, res) => {
      let track = 0
      const progress = setInterval(() => {
        res.write("" + track++)
        console.log(track)
        if (track === STEPS) {
          clearInterval(progress)
          res.end()
        }
      }, PROCESSTIME.HTML / STEPS)
    },
  },
  "/to-pdf": {
    post: (req, res) => {
      console.log("TO PDF")
      res.status(200).send()
    },
  },
}

bootstrapApi(config, routeSpec, () => {})

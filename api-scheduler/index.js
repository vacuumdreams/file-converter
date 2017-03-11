"use strict"

let io

const fetch = require("node-fetch")
const bodyParser = require("body-parser")

const config = require("./config")
const bootstrapApi = require("../lib/api")

const serviceMap = {
  "converter": require("../api-converter/config").server.url,
}

const routeSpec = {
  "/schedule": {
    post: (req, res) => {
      const {service, task, method, data} = req.body
      const url = serviceMap[service]

      if (!url) return res.status(400).send("Requested service does not exist")

      fetch(`${url}/${task}`, {method, body: data})
        .then(result => {
          res.status(200).send("OKAY!")
          result.body.on("data", (data) => console.log(data.toString()))
        })
        .catch(err => {
          console.log(err)
          res.status(500).send(`There was an error connecting to service '${service}'`)
        })
      
      return null
    },
  },
}

bootstrapApi(config, routeSpec, api => {
  io = require("socket.io").listen(require("http").createServer(api))
  api.use(bodyParser.json())
})

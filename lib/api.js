const url = require("url")

const cors = require("cors")

const api = require("express")()

module.exports = (config, routeSpec, cb) => {

  const port = url.parse(config.server.url).port || 8000

  api.use(cors({
    origin: (origin, callback) => {
      if (!config.server.cors || config.server.cors === "*" || config.server.cors.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error("Not allowed"), false)
    },
  }))

  cb(api)

  // attach routes
  Object.keys(routeSpec).map(path => {
    Object.keys(routeSpec[path]).map(method => {
      api[method](path, routeSpec[path][method])
    })
  })

  // handle errors
  api.use((req, res, next) => {
    console.log(req.url, req.method)
    if (Object.keys(routeSpec).indexOf(req.url) < 0) {
      res.status(404).send({ message: `Endpoint '${req.url}' does not exist` })
    }
    if (Object.keys(routeSpec[req.url]).indexOf(req.method) < 0) {
      res.status(405).send({ method: `Method '${req.method}' not allowed for '${req.url}'` })
    }
    next()
  })

  api.listen(port, () => {
    console.log(`${config.server.name} started and listening on port ${port}`)
  })
}


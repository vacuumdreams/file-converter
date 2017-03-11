const url = require("url")

const cors = require("cors")

const api = require("express")()

module.exports = (config, cb) => {

  const port = url.parse(config.server.url).port || 8000

  api.use(cors({
    origin: (origin, cb) => {
      if (!config.server.cors || config.server.cors === "*" || config.server.cors.includes(origin)) {
        return cb(null, true)
      }
      return cb(new Error("Not allowed"), false)
    },
  }))

  cb(api)

  api.listen(port, () => {
    console.log(`${config.server.name} started and listening on port ${port}`)
  })
}


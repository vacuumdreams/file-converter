const url = require("url")

const bodyParser = require("body-parser")
const cors = require("cors")

const api = require("express")()

module.exports = (config, cb) => {

  const port = url.parse(config.server.url).port || 8000

  api.use(bodyParser.json())
  api.use(cors({
    origin: (origin, cb) => {
      if (!config.server.cors || config.server.cors === "*" || config.server.cors.includes(origin)) {
        return cb(null, true)
      }
      cb(new Error("Not allowed"), false)
    }
  }))

  cb(api)

  api.listen(port, () => {
    console.log(`${config.server.name} started and listening on port ${port}`)
  })
}


const io = require("socket.io")()
const bodyParser = require("body-parser")

const bootstrapApi = require("../../lib/api")
const routes = require("./routes")

module.exports = config => bootstrapApi(config, routes(config), api => {
  api.use(bodyParser.json())

  io.on("connection", client => {
    client.emit("id", client.id)
  })

  io.listen(config.io.port)
})

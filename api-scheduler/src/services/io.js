module.exports = config => {
  const io = require("socket.io")()
  io.on("connection", client => {
    client.emit("id", client.id)
  })
  io.listen(config.port)
  return io
}

const io = require('socket.io-client')

module.exports = function ServiceScheduleIO() {
  const socket = io('http://localhost:8021')
  return ({
    emit: socket.emit.bind(socket),
    on: socket.on.bind(socket),
  })
}

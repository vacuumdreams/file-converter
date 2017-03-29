const io = require('socket.io-client')

function ServiceScheduleIO() {
  const socket = io('http://localhost:8021')
  return ({
    emit: socket.emit.bind(socket),
    on: socket.on.bind(socket),
    unsubscribe: socket.removeAllListeners.bind(socket),
  })
}


ServiceScheduleIO.fnname = 'ServiceScheduleIO'
module.exports = ServiceScheduleIO

const fetch = require('node-fetch')

const TYPEMAP = {
  'to-html': 'HTML',
  'to-pdf': 'PDF',
}

const STATUSMAP = {
  'QUEUED': 'queued',
  'STARTED': 'started',
  'ERRORED': 'errored',
  'COMPLETED': 'completed',
}

const getType = task => TYPEMAP[task]

module.exports = (config, io, queue) => ({
  post: (req, res) => {
    const {id, client, service, task, method, data, progress} = req.body
    const url = config.registry[service]

    if (!url) return res.status(400).send({ message: 'Requested service does not exist' })

    res.status(200).send({ 
      message: 'OK',
      data: {
        id,
        status: STATUSMAP.QUEUED,
        type: getType(task),
        started: new Date().toISOString(),
      },
    })

    queue(() => fetch(`${url}/${task}`, { method, body: data })
      .then(result => {
        let aborted = false
        const socket = io.sockets.connected[client]

        if (client && progress) {
          socket.emit(`start-${id}`)

          result.body.on('end', () => {
            if (!aborted) socket.emit(`complete-${id}`)
            socket.removeAllListeners(`abort-${id}`)
          })

          result.body.on('error', error => {
            socket.emit(`error-${id}`, {
              error,
              message: `There was an error processing '${task}'`,
            })
          })
          
          socket.on(`abort-${id}`, () => {
            aborted = true
            result.body.end()
          })
          
          result.body.on('data', data => {
            socket.emit(`progress-${id}`, data.toString())
          })
        }

        return result.body
      })
      .catch(error => {
        io.to(client).emit(`error-${id}`, {
          error,
          message: `Unable to connect to service '${service}' on endpoint '${task}'`,
        })
      })
    )
    
    return null
  },
})

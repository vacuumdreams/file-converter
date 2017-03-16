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
        io.to(client).emit(`start-${id}`)
        result.body.on('end', () => {
          console.log('END! ' + id)
          io.to(client).emit(`complete-${id}`)
        })
        result.body.on('error', error => io.to(client).emit(`error-${id}`, {
          error,
          message: `There was an error processing '${task}'`,
        }))
        
        if (progress) {
          result.body.on('data', data => {
            console.log(data.toString())
            io.to(client).emit(`progress-${id}`, data.toString())
          })
        }
      })
      .catch(() => {
        io.to(client).emit(`error-${id}`, { 
          message: `Unable to connect to service '${service}' on endpoint '${task}'`,
        })
      })
    )
    
    return null
  },
})

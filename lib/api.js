const url = require('url')
const cors = require('cors')
const api = require('express')()

module.exports = ({config, routes, services, middlewares, callback}) => {

  const port = url.parse(config.server.url).port || 8000

  const serviceSpec = (typeof services === 'function') ? services(config.services) : {}
  const routeSpec = (typeof routes === 'function') ? routes(config, serviceSpec) : []
  const mwSpec = (typeof middlewares === 'function') ? middlewares(config) : undefined

  api.use(cors({
    origin: (origin, callback) => {
      if (!config.server.cors || config.server.cors === '*' || config.server.cors.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed'), false)
    },
  }))

  if (mwSpec) api.use(mwSpec)
  if (typeof callback === 'function') callback(api)

  // attach routes
  Object.keys(routeSpec).map(path => {
    Object.keys(routeSpec[path]).map(method => {
      api[method](path, routeSpec[path][method])
    })
  })

  if (routeSpec.length > 0) {
    // handle errors
    api.use((req, res, next) => {
      if (Object.keys(routeSpec).indexOf(req.url) < 0) {
        res.status(404).send({ message: `Endpoint '${req.url}' does not exist` })
      }
      if (Object.keys(routeSpec[req.url]).indexOf(req.method) < 0) {
        res.status(405).send({ method: `Method '${req.method}' not allowed for '${req.url}'` })
      }
      next()
    })
  }
  
  api.listen(port, () => {
    console.log(`${config.server.name} started and listening on port ${port}`)
  })
}


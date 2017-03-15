const host = process.env.API_SCHEDULER_HOST  || 'http://localhost'
const port = process.env.API_SCHEDULER_PORT || '8020'
const ioport = process.env.API_SCHEDULER_PORT_IO || '8021'

module.exports = {
  server: {
    name: 'api-scheduler',
    url: `${host}:${port}`,
    cors: '*',
  },
  registry: {
    converter: 'http://localhost:8010',
  },
  services: {
    io: {
      port: ioport,
    },
    queue: {
      max: 3,
    },
  },
}

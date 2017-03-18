const host = process.env.APP_UI_SERVER_HOST  || 'http://localhost'
const port = process.env.APP_UI_SERVER_PORT || '7000'

module.exports = {
  server: {
    name: 'server-ui',
    url: `${host}:${port}`,
    cors: '*',
  },
  registry: {
    scheduler: 'http://localhost:8020',
    schedulerIO: 'http://localhost:8021',
  },
  client: {

  },
}

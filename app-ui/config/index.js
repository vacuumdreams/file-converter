const host = process.env.APP_UI_SERVER_HOST  || 'http://localhost'
const port = process.env.APP_UI_SERVER_PORT || '7000'

module.exports = {
  server: {
    name: 'server-ui',
    url: `${host}:${port}`,
    cors: '*',
  },
  client: {

  },
}

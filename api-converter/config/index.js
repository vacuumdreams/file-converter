const host = process.env.API_CONVERTER_HOST  || 'http://localhost'
const port = process.env.API_CONVERTER_PORT || '8010'

module.exports = {
  server: {
    name: 'api-converter',
    url: `${host}:${port}`,
    cors: '*',
  },
  services: {
    fileprocess: {
      STEPS: 100,
      TIME: {
        HTML: 10000,
        PDF: 10,
      },
    },
  },
}

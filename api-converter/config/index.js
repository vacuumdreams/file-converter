const host = process.env.API_CONVERTER_HOST  || "http://localhost"
const port = process.env.API_CONVERTER_PORT || "8010"

module.exports = {
  server: {
    name: "api-converter",
    url: `${host}:${port}`,
    cors: "*",
  },
}

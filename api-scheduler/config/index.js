const path = require("path")

const host = process.env.API_SCHEDULER_HOST  || "http://localhost"
const port = process.env.API_SCHEDULER_PORT || "8010"

module.exports = {
  server: {
    name: "api-converter",
    url: `${host}:${port}`,
    cors: "*",
  },
}

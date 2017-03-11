const host = process.env.API_SCHEDULER_HOST  || "http://localhost"
const port = process.env.API_SCHEDULER_PORT || "8020"

module.exports = {
  server: {
    name: "api-scheduler",
    url: `${host}:${port}`,
    cors: "*",
  },
}

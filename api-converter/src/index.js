const bootstrapApi = require("../../lib/api")

const routes = require("./routes")
const services = require("./services")

module.exports = config => bootstrapApi(config, routes(config, services), () => {})

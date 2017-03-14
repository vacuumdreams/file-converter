const schedule = require("./schedule")

module.exports = config => ({
  "/schedule": schedule(config),
})

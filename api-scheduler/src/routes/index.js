const schedule = require("./schedule")

module.exports = (config, {io, queue}) => ({
  "/schedule": schedule(config, io, queue),
})

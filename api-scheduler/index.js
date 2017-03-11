const config = require("./config")
const bootstrapApi = require("../lib/api")

bootstrapApi(config, api => {
  
  api.post("schedule", (req, res) => {
    console.log("SCHEDULE TASK")
    res.send(200)
  })

})

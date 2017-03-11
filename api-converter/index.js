const config = require("./config")
const bootstrapApi = require("../lib/api")

bootstrapApi(config, api => {

  api.post("to-html", (req, res) => {
    console.log("TO HTML")
    res.send(200)
  })

  api.post("to-pdf", (req, res) => {
    console.log("TO PDF")
    res.send(200)
  })

})

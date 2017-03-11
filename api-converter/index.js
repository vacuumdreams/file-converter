const config = require("./config")
const bootstrapApi = require("../lib/api")

const PROCESSTIME = {
  HTML: 100,
  PDF: 10,
}

bootstrapApi(config, api => {

  api.post("/to-html", (req, res) => {
    console.log("TO HTML")
    res.status(200).send()
  })

  api.post("/to-pdf", (req, res) => {
    console.log("TO PDF")
    res.status(200).send()
  })

})

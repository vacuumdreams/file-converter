const url = require("url")

const config = require("./config")

const bodyParser = require("body-parser")
const cors = require("cors")

const app = require("express")()

const port = url.parse(config.server.url).port || 8000

app.use(bodyParser.json())
app.use(cors({
  origin: (origin, cb) => {
    if (!config.server.cors || config.server.cors === "*" || config.server.cors.includes(origin)) {
      return cb(null, true)
    }
    cb(new Error("Not allowed"), false)
  }
}))

app.post("to-html", function (req, res) {
  console.log("TO HTML")
  res.send(200)
})

app.post("to-pdf", function (req, res) {
  console.log("TO PDF")
  res.send(200)
})

app.listen(port, () => {
  console.log(`${config.server.name} started and listening on port ${port}`)
})


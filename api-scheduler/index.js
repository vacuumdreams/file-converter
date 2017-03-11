const fetch = require("node-fetch")
const bodyParser = require("body-parser")

const config = require("./config")
const bootstrapApi = require("../lib/api")

const serviceMap = {
  "converter": require("../api-converter/config").server.url,
}

bootstrapApi(config, api => {

  api.use(bodyParser.json())
  
  api.post("/schedule", (req, res) => {
    const {service, task, method, data} = req.body
    const url = serviceMap[service]

    if (!url) return res.status(400).send("Requested service does not exist")

    fetch(`${url}/${task}`, {method, body: data})
      .then(result => {
        console.log(result)
        res.status(200).send("OKAY!")
      })
      .catch(() => res.status(500).send(`There was an error connecting to service ${service}`))
    
    return null
  })

})

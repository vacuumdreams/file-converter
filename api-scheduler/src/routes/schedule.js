module.exports = config => ({
  post: (req, res) => {
    const {id, client, service, task, method, data, progress} = req.body
    const url = config.registry[service]

    if (!url) return res.status(400).send({ message: "Requested service does not exist" })

    fetch(`${url}/${task}`, {method, body: data})
      .then(result => {
        res.status(200).send({ message: "OK" })
        
        if (progress) {
          result.body.on("data", data => {
            console.log(data.toString())
            io.to(client).emit(`progress-${id}`, data.toString())
          })
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({ message: `There was an error connecting to service '${service}'` })
      })
    
    return null
  },
})

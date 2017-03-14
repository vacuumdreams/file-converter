module.exports = (config, fileprocess) => ({
  post: (req, res) => fileprocess("html", res),
})

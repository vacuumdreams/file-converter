module.exports = (config, fileprocess) => ({
  post: (req, res) => fileprocess("pdf", res),
})

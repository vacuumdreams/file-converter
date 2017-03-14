const toHtml = require("./to-html")
const toPdf = require("./to-pdf")

module.exports = (config, {fileprocess}) => ({
  "/to-html": toHtml(config, fileprocess),
  "/to-pdf": toPdf(config, fileprocess),
})

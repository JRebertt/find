// biome-ignore lint/suspicious/noGlobalAssign: <explanation>
require = require('esm')(module /*, options*/)
module.exports = require('./build/https/server.js')

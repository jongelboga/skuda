const path = require('path')
const fs = require('fs-extra')

const dir = path.resolve(__dirname, '../dist')
fs.removeSync(dir)

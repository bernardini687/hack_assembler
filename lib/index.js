const path = require('path')
const assemble = require('./assemble')

module.exports = function (filename) {
  const filesource = path.join(process.cwd(), filename)
  const filenameNoExt = path.basename(filesource, '.asm')
  const filedest = path.join(process.cwd(), `${filenameNoExt}.hack`)

  console.log('DEBUG:', filedest)

  assemble(filesource, filedest)
}

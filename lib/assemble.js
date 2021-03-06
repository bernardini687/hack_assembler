const fs = require('fs')
const { PassThrough } = require('stream')
const es = require('event-stream')
const { ReReadable } = require('rereadable-stream')
const { stripComments, resolveLabels, parseInstruction, translateParts } = require('./core')

const passThrough = new PassThrough()
const firstPass = new ReReadable()

module.exports = function assemble (filepath) {
  if (!fs.existsSync(filepath)) {
    console.error('no such file in current directory: ' + filepath)
    process.exit(1)
  }

  fs.createReadStream(filepath)
    .pipe(es.split(/\r?\n/))
    .pipe(stripComments)
    .pipe(resolveLabels)
    .pipe(passThrough)
    .pipe(firstPass)

  // passThrough.on('data', console.log)                        // log buffers
  // passThrough.on('data', d => { console.log(d.toString()) }) // log strings

  firstPass.on('finish', () => {
    firstPass.rewind()
      .pipe(es.mapSync(parseInstruction))
      .pipe(es.mapSync(translateParts))
      .pipe(es.join('\n')) // what about carriage return?
      .pipe(process.stdout)
  })
}

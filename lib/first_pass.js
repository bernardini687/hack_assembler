const { Transform } = require('stream')

// const symbols = require('./data/symbols')
// const metadata = require('./data/metadata')
const { increaseCurrentLine } = require('./core')

const stripComments = new Transform({
  transform (chunk, _encoding, next) {
    const commentStartIndex = chunk.indexOf('//')

    if (commentStartIndex === 0) {
      next()
    } else if (commentStartIndex > 0) {
      next(null, chunk.slice(0, commentStartIndex))
    } else {
      next(null, chunk)
    }
  }
})

class LabelResolver extends Transform {
  constructor (symbols, metadata) {
    super()
    this.symbols = symbols
    this.metadata = metadata
  }

  _transform (chunk, _encoding, next) {
    if (chunk.includes('(')) {
      const [label] = chunk.toString().match(/\w+/)
      this.symbols[label] = this.metadata.__currentLine__ // TODO: make sure (LABEL) cannot appear more than one
      next()
    } else {
      increaseCurrentLine(this.metadata)
      next(null, chunk)
    }
  }
}

module.exports = {
  stripComments,
  LabelResolver
}

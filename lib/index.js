const path = require('path')
const assemble = require('./assemble')

const [filename] = process.argv.slice(2)

if (filename === undefined) {
  console.error('no argument given')
  process.exit(1)
}

const filepath = path.join(__dirname, filename)

assemble(filepath)

// node lib '../test/Max.asm'

const symbols = require('./data/symbols')
const { valueOrInsert } = require('./code/utils')

const [filename] = process.argv.slice(2)

console.log(filename)

console.log(valueOrInsert(symbols, 'KBD', 99))
console.log(valueOrInsert(symbols, 'GOD', 99))

console.log(symbols)
console.log(__dirname) // path.join __dirname, filename

//  first pass: fs.createReadStream
// second pass: fs.createReadStream pipe fs.createWriteStream (bytes)

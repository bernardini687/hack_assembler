const symbols = require('./data/symbols')

const [filename] = process.argv.slice(2)

console.log(filename)

function valueOrInsert(obj, prop, val) {
  if (prop in obj)
    return obj[prop]

  return obj[prop] = val
}

console.log(valueOrInsert(symbols, 'KBD', 99))
console.log(valueOrInsert(symbols, 'GOD', 99))

console.log(symbols)
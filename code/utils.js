const { COMPUTATIONS, DESTINATIONS, JUMPS } = require('../data/dictionary')

function valueOrInsert (obj, prop, val) {
  if (!(prop in obj)) {
    obj[prop] = val
  }
  return obj[prop]
}

function parseInstruction (instruction) {
  let pattern

  if (instruction.includes('=')) {
    pattern = /(?<dest>.+)=(?<comp>.+)/
  } else {
    pattern = /(?<comp>.+);(?<jump>.+)/
  }

  const { groups } = instruction.toString().match(pattern)

  Object.keys(groups).forEach(k => { groups[k] = groups[k].trim() })

  return groups
}

function translateParts ({ comp, dest, jump }) {
  return '111' + COMPUTATIONS[comp] + DESTINATIONS[dest] + JUMPS[jump]
}

module.exports = {
  valueOrInsert,
  parseInstruction,
  translateParts
}

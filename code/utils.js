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

function translateParts (parts) {

}

module.exports = {
  valueOrInsert,
  parseInstruction,
  translateParts
}

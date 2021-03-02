function valueOrInsert (obj, prop, val) {
  if (!(prop in obj)) {
    obj[prop] = val
  }
  return obj[prop]
}

function parseInstruction (instruction) {
  let regexp

  // '  D = P+M '.match(/\S/g) -> [ 'D', '=', 'P', '+', 'M' ]

  if (instruction.includes('=')) {
    regexp = /(?<dest>.+)=(?<comp>.+)/
  } else {
    regexp = /(?<comp>.+);(?<jump>.+)/
  }

  const { groups } = instruction.toString().match(regexp)

  Object.keys(groups).forEach(k => { groups[k] = groups[k].trim() })

  return groups
}

module.exports = {
  valueOrInsert,
  parseInstruction
}

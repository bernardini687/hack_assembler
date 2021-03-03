const { COMPUTATIONS, DESTINATIONS, JUMPS } = require('./data/dictionary')

function valueOrInsert (obj, prop, val) {
  if (!(prop in obj)) {
    obj[prop] = val
  }
  return obj[prop]
}

function parseInstruction (instruction) {
  if (instruction.includes('@')) {
    return parseInstructionA(instruction)
  } else {
    return parseInstructionC(instruction)
  }
}

function translateParts ({ comp, dest, jump, addr }) {
  if (addr !== undefined) {
    return composeBinaryA(addr)
  } else {
    return composeBinaryC(comp, dest, jump)
  }
}

// private

function parseInstructionC (instruction) {
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

function composeBinaryC (comp, dest, jump) {
  return '111' + COMPUTATIONS[comp] + DESTINATIONS[dest] + JUMPS[jump]
}

function parseInstructionA (instruction) {
  const { groups } = instruction.toString().match(/(?<addr>\d+)/)

  groups.addr = Number(groups.addr)

  return groups
}

function composeBinaryA (addr) {
  return '0' + addr.toString(2).padStart(15, '0')
}

module.exports = {
  valueOrInsert,
  parseInstruction,
  translateParts
}

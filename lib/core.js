const { Transform } = require('stream')
const { COMPUTATIONS, DESTINATIONS, JUMPS } = require('./data/dictionary')
const metadata = require('./data/metadata')
const symbols = require('./data/symbols')

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

// stream interfaces

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

const resolveLabels = new Transform({
  transform (chunk, _encoding, next) {
    if (chunk.includes('(')) {
      const [label] = chunk.toString().match(/\w+/)
      symbols[label] = metadata.__currentLine__ // TODO: make sure (LABEL) cannot appear more than once
      next()
    } else {
      metadata.__currentLine__++
      next(null, chunk)
    }
  }
})

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

function parseInstructionA (instruction) {
  const i = instruction.toString().replace('@', '').trim()

  let groups = i.match(/^(?<addr>\d+)$/)?.groups

  if (groups === undefined) {
    groups = i.match(/^(?<symbol>\w+)$/).groups
    groups.addr = findOrAssignNewAddress(groups.symbol, metadata.__nextAddress__)
  } else {
    groups.addr = Number(groups.addr)
  }

  return groups
}

function composeBinaryC (comp, dest, jump) {
  return '111' + COMPUTATIONS[comp] + DESTINATIONS[dest] + JUMPS[jump]
}

function composeBinaryA (addr) {
  return '0' + addr.toString(2).padStart(15, '0')
}

function findOrAssignNewAddress (symbol, val) {
  if (!(symbol in symbols)) {
    symbols[symbol] = val
    metadata.__nextAddress__++
  }
  return symbols[symbol]
}

module.exports = {
  parseInstruction,
  translateParts,
  stripComments,
  resolveLabels
}

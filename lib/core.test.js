const { valueOrInsert, increaseCurrentLine, parseInstruction, translateParts } = require('./core')

describe('valueOrInsert', () => {
  it('returns the value when found', () => {
    const obj = { foo: 1, bar: 2 }
    const val = valueOrInsert(obj, 'foo', 3)
    expect(val).toBe(1)
  })

  it('adds the value when not found', () => {
    const obj = { foo: 1, bar: 2 }
    const val = valueOrInsert(obj, 'baz', 3)
    expect(val).toBe(3)
    expect(obj.baz).toBe(3)
  })
})

describe('increaseCurrentLine', () => {
  it('increases `__currentLine__` when found', () => {
    const obj = { __currentLine__: 0, foo: 1, bar: 2 }
    increaseCurrentLine(obj)
    expect(obj.__currentLine__).toBe(1)
  })

  it('increases `__currentLine__` multiple times', () => {
    const obj = { __currentLine__: 0, foo: 1, bar: 2 }
    increaseCurrentLine(obj)
    increaseCurrentLine(obj)
    increaseCurrentLine(obj)
    expect(obj.__currentLine__).toBe(3)
  })

  it('does nothing when not found', () => {
    const obj = { foo: 1, bar: 2 }
    increaseCurrentLine(obj)
    expect(obj).toStrictEqual(obj)
  })
})

describe('parseInstruction', () => {
  function nullProtoObj (props) {
    return Object.assign(Object.create(null), props)
  }

  describe('C instructions', () => {
    it('parses a C instruction with dest into its parts', () => {
      const parts = parseInstruction('AM=M-1')
      expect(parts).toStrictEqual(nullProtoObj({ dest: 'AM', comp: 'M-1' }))
    })

    it('parses a C instruction with jump into its parts', () => {
      const parts = parseInstruction('D;JGT')
      expect(parts).toStrictEqual(nullProtoObj({ comp: 'D', jump: 'JGT' }))
    })

    it('parses a C instruction with dest and whitespace into its parts', () => {
      const parts = parseInstruction('  D = D-M ')
      expect(parts).toStrictEqual(nullProtoObj({ dest: 'D', comp: 'D-M' }))
    })

    it('parses a C instruction with jump and whitespace into its parts', () => {
      const parts = parseInstruction('  0; JMP')
      expect(parts).toStrictEqual(nullProtoObj({ comp: '0', jump: 'JMP' }))
    })

    it('also handles a Buffer', () => {
      const parts = parseInstruction(Buffer.from('AM = M-1'))
      expect(parts).toStrictEqual(nullProtoObj({ dest: 'AM', comp: 'M-1' }))
    })
  })

  describe('A instructions', () => {
    it('picks the address from an A instruction', () => {
      const parts = parseInstruction('@2')
      expect(parts).toStrictEqual(nullProtoObj({ addr: 2 }))
    })

    it('picks the address from an A instruction with whitespace', () => {
      const parts = parseInstruction('  @3  ')
      expect(parts).toStrictEqual(nullProtoObj({ addr: 3 }))
    })

    it('also handles a Buffer', () => {
      const parts = parseInstruction(Buffer.from('@ 0'))
      expect(parts).toStrictEqual(nullProtoObj({ addr: 0 }))
    })
  })
})

describe('translateParts', () => {
  it('translates C parts with dest into binary', () => {
    let bin = translateParts({ dest: 'D', comp: 'D-A' })
    expect(bin).toBe('1110010011010000')

    bin = translateParts({ dest: 'M', comp: 'D+M' })
    expect(bin).toBe('1111000010001000')

    bin = translateParts({ dest: 'M', comp: 'M+1' })
    expect(bin).toBe('1111110111001000')
  })

  it('translates C parts with jump into binary', () => {
    let bin = translateParts({ comp: 'D', jump: 'JGT' })
    expect(bin).toBe('1110001100000001')

    bin = translateParts({ comp: '0', jump: 'JMP' })
    expect(bin).toBe('1110101010000111')
  })

  it('translates A addresses into binary', () => {
    let bin = translateParts({ addr: 0 })
    expect(bin).toBe('0000000000000000')

    bin = translateParts({ addr: 21845 })
    expect(bin).toBe('0101010101010101')

    bin = translateParts({ addr: 32767 })
    expect(bin).toBe('0111111111111111')
  })
})

test('translation of instructions', () => {
  let bin = translateParts(parseInstruction('  M = 1'))
  expect(bin).toBe('1110111111001000')

  bin = translateParts(parseInstruction('M=0'))
  expect(bin).toBe('1110101010001000')

  bin = translateParts(parseInstruction('  D = M  '))
  expect(bin).toBe('1111110000010000')

  bin = translateParts(parseInstruction('M=D+M'))
  expect(bin).toBe('1111000010001000')

  bin = translateParts(parseInstruction('  D; JGT  '))
  expect(bin).toBe('1110001100000001')

  bin = translateParts(parseInstruction('0;JMP'))
  expect(bin).toBe('1110101010000111')

  bin = translateParts(parseInstruction('@5'))
  expect(bin).toBe('0000000000000101')

  bin = translateParts(parseInstruction('  @ 2'))
  expect(bin).toBe('0000000000000010')

  bin = translateParts(parseInstruction('@7  '))
  expect(bin).toBe('0000000000000111')
})

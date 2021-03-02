const { valueOrInsert, parseInstruction, translateParts } = require('./utils')

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

describe('parseInstruction', () => {
  function nullProtoObj (props) {
    return Object.assign(Object.create(null), props)
  }

  describe('without symbols', () => {
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
})

describe('translateParts', () => {
  xit('translates C parts with dest into binary', () => {
    let binary = translateParts({ dest: 'D', comp: 'D-A' })
    expect(binary).toBe('1110 0100 1101 0000'.trim())

    binary = translateParts({ dest: 'M', comp: 'D+M' })
    expect(binary).toBe('1111 0000 1000 1000'.trim())

    binary = translateParts({ dest: 'M', comp: 'M+1' })
    expect(binary).toBe('1111 1101 1100 1000'.trim())
  })

  xit('translates C parts with jump into binary', () => {
    let binary = translateParts({ comp: 'D', jump: 'JGT' })
    expect(binary).toBe('1110 0011 0000 0001'.trim())

    binary = translateParts({ comp: '0', jump: 'JMP' })
    expect(binary).toBe('1110 1010 1000 0111'.trim())
  })
})

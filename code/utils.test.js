const { valueOrInsert, parseInstruction } = require('./utils')

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

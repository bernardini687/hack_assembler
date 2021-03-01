const { valueOrInsert } = require('./utils')

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

// page 7 of 18
// file:///Users/oscar/Downloads/44046b_b73759b866b249a0b3a715bf5a18f668.pdf

describe('parseInstruction', () => {
  describe('without symbols', () => {
    xit('parses a C instruction with dest into its components', () => {
      const components = 'AM=M-1'

      expect(components).toStrictEqual({ dest: 'AM', comp: 'M-1', jump: '' })
    })

    xit('parses a C instruction with jump into its components', () => {
      const components = 'D;JGT'

      expect(components).toStrictEqual({ dest: '', comp: 'D', jump: 'JGT' })
    })

    xit('parses a C instruction with dest and whitespace into its components', () => {
      const components = '  D = D-M '

      expect(components).toStrictEqual({ dest: 'D', comp: 'D-M', jump: '' })
    })

    xit('parses a C instruction with jump and whitespace into its components', () => {
      const components = '  0; JMP'

      expect(components).toStrictEqual({ dest: '', comp: '0', jump: 'JMP' })
    })
  })
})

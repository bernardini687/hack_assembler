const es = require('event-stream')
const fs = require('fs')
const metadata = require('./data/metadata')
const symbols = require('./data/symbols')
const { parseInstruction, translateParts, stripComments, resolveLabels } = require('./core')

const initialSymbols = { ...symbols }

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

  describe('symbolic A instructions', () => {
    it('lookups for R1 value in the symbol table', () => {
      const parts = parseInstruction('@R1')
      expect(parts).toStrictEqual(nullProtoObj({ addr: 1, symbol: 'R1' }))
    })

    it('lookups for KBD value in the symbol table', () => {
      const parts = parseInstruction('@ KBD')
      expect(parts).toStrictEqual(nullProtoObj({ addr: 24576, symbol: 'KBD' }))
    })

    it('it updates the symbol table and the metadata', () => {
      let parts = parseInstruction('  @foo  ')
      expect(parts).toStrictEqual(nullProtoObj({ addr: 16, symbol: 'foo' }))
      expect(metadata.__nextAddress__).toBe(17)

      parts = parseInstruction('@bar')
      expect(parts).toStrictEqual(nullProtoObj({ addr: 17, symbol: 'bar' }))
      expect(metadata.__nextAddress__).toBe(18)

      parts = parseInstruction('@sys.init')
      expect(parts).toStrictEqual(nullProtoObj({ addr: 18, symbol: 'sys.init' }))
      expect(metadata.__nextAddress__).toBe(19)

      parts = parseInstruction(Buffer.from('@foo'))
      expect(parts).toStrictEqual(nullProtoObj({ addr: 16, symbol: 'foo' }))
      expect(metadata.__nextAddress__).toBe(19)

      expect(symbols).toStrictEqual({
        ...initialSymbols,
        foo: 16,
        bar: 17,
        'sys.init': 18
      })
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

test('`stripComments` and `resolveLabels`', () => {
  fs.createReadStream('./test/Test.asm')
    .pipe(es.split(/\r?\n/))
    .pipe(stripComments)
    .pipe(resolveLabels)
    .on('finish', () => {
      expect(metadata.__currentLine__).toBe(24)

      // `symbols` may contain by-products of previous tests.
      // until proper isolation solution is found, let's match against an expected subset of properties
      expect(symbols).toMatchObject({
        ...initialSymbols,
        LOOP: 4,
        'init.stop': 18,
        END: 22
      })
    })
})

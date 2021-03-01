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

const { valueOrInsert } = require('./utils')

test('return the value when found', () => {
  const obj = { foo: 1, bar: 2 }
  const val = valueOrInsert(obj, 'foo', 3)

  expect(val).toBe(1)
})

test('add the value when not found', () => {
  const obj = { foo: 1, bar: 2 }
  const val = valueOrInsert(obj, 'baz', 3)

  expect(val).toBe(3)
  expect(obj.baz).toBe(3)
})

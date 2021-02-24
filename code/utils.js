function valueOrInsert (obj, prop, val) {
  if (!(prop in obj)) {
    obj[prop] = val
  }
  return obj[prop]
}

exports.valueOrInsert = valueOrInsert

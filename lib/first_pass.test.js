const es = require('event-stream')

const fs = require('fs')

const metadata = require('./data/metadata')
const symbols = require('./data/symbols')
const { stripComments, LabelResolver } = require('./first_pass')

const predefined = { ...symbols }

test('comment stripping and label resolving', () => {
  const resolveLabels = (sym, meta) => new LabelResolver(sym, meta)

  fs.createReadStream('./test/Test.asm')
    .pipe(es.split(/\r?\n/))
    .pipe(stripComments)
    .pipe(resolveLabels(symbols, metadata))
    .on('finish', () => {
      expect(metadata.__currentLine__).toBe(24)
      expect(symbols).toStrictEqual({
        ...predefined,
        LOOP: 4,
        STOP: 18,
        END: 22
      })
    })
})

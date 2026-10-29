import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeProduct, ProductValidationError } from './mockDatabase.js'

const base = { name: ' Gorra ', category: 'Streetwear', price: '85000', stockCount: '4', stockStatus: 'in_stock', images: [' /productos/Gorras.png ', ''] }

test('normalizeProduct coerces and trims a valid row', () => {
  const p = normalizeProduct(base)
  assert.equal(p.name, 'Gorra')
  assert.equal(p.price, 85000)
  assert.equal(p.rewardPoints, 85)
  assert.deepEqual(p.images, ['/productos/Gorras.png'])
})

test('normalizeProduct rejects what the future table would refuse', () => {
  const bads = [{ name: '' }, { category: 'Otra' }, { price: 0 }, { price: 9.5 }, { stockCount: -1 }, { stockStatus: 'x' }, { images: ['http://insecure.com/a.png'] }, { images: [] }]
  for (const bad of bads) {
    assert.throws(() => normalizeProduct({ ...base, ...bad }), ProductValidationError)
  }
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { luhn, validExpiry, validNequi, formatCardNumber, formatExpiry } from './validate.js'

test('luhn accepts test cards and rejects typos', () => {
  assert.equal(luhn('4242 4242 4242 4242'), true)
  assert.equal(luhn('4242 4242 4242 4241'), false)
  assert.equal(luhn('4242'), false)
})

test('expiry must be a real, future MM/AA', () => {
  const now = new Date(2026, 9, 29)
  assert.equal(validExpiry('10/26', now), true)
  assert.equal(validExpiry('09/26', now), false)
  assert.equal(validExpiry('13/30', now), false)
})

test('nequi needs a 10-digit Colombian mobile', () => {
  assert.equal(validNequi('300 123 4567'), true)
  assert.equal(validNequi('6011234567'), false)
})

test('formatters group digits', () => {
  assert.equal(formatCardNumber('4242424242424242'), '4242 4242 4242 4242')
  assert.equal(formatExpiry('1228'), '12/28')
})

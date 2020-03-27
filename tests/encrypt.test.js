import crypto from '../src/encrytor'
import ml from '../src'
import { Buffer } from 'buffer'

const keys = crypto.generateAccountKeys()
const input = { test: 'test' }

test('Encrypt document', () => {
  let encrypted = ml.encrypt(input, keys.publicKey)
  let decrypted = ml.decrypt(encrypted, keys.privateKey)

  expect(decrypted).toStrictEqual(input)
})

test('Generate unlock key', () => {
  let key = ml.generateUnlockKey('salt', 'seed', 'passphrase')

  expect(key).toStrictEqual(
    Buffer.from([181, 224, 81, 201, 29, 57, 118, 120, 241, 19, 12, 219, 50, 183, 16, 5, 17, 91, 189, 16, 1, 116, 28, 172, 205, 121, 11, 35, 34, 175, 93, 115])
  )
})

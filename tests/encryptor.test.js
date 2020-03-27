import crypto from '../src/encrytor'
import { Buffer } from 'buffer'

const userData = {
  seed: 'askdlasdlaksdklasdlkasl',
  salt: 'askdlasdlaksdklasdlkasl',
}
const passphrase = 'passphrase'

const MUK = crypto.generateUnlockKey(userData, passphrase)
const keys = crypto.generateAccountKeys()

test('Generating unlock key', () => {
  expect(MUK).toStrictEqual(
    Buffer.from([202, 89, 90, 125, 40, 171, 96, 126, 19, 128, 240, 76, 27, 131, 46, 235, 107, 107, 48, 255, 221, 154, 192, 114, 248, 184, 225, 218, 217, 106, 57, 68])
  )
})

test('Generating valid account encryption keys', () => {
  const plaintext = 'TEST'
  let encrypted = crypto.encrypt(plaintext, keys.publicKey)
  let decrypted = crypto.decrypt(encrypted, keys.privateKey)

  expect(decrypted).toBe(plaintext)
})

test('Lock and unlock encryption keys', () => {
  let locked = crypto.lock(keys.privateKey, MUK)
  let unlocked = crypto.unlock(locked, MUK)

  expect(keys.privateKey).toBe(unlocked)
})

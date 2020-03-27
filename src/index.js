import crypto from './encrytor'
import serializer from './serializer'

export default {
  generateUnlockKey: (salt, seed, passphrase) => {
    return crypto.generateUnlockKey({
      salt: salt,
      seed: seed
    }, passphrase)
  },
  generateAccountKeys: crypto.generateAccountKeys,
  lock: crypto.lock,
  unlock: crypto.unlock,
  encrypt: (data, publicKey) => {
    let source = serializer.serializeObject(data)
    return crypto.encrypt(source, publicKey)
  },
  decrypt: (data, privateKey) => {
    let output = crypto.decrypt(data, privateKey)
    return serializer.deserialize(output)
  }
}

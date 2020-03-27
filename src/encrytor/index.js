import * as pbkdf2 from 'pbkdf2'
import hkdf from 'futoin-hkdf'
import xor from 'buffer-xor'
import NodeRSA from 'node-rsa'
import aesjs from 'aes-js'

const UNICODE_NORMALIZATION_FORM = 'NFKD'
/**
 * Function derives MUK - master unlock key
 * MUK is used to encrypt and decrypt the data encryption keys, in particular - user private key
 *
 * @param dataProvider
 * @param passphrase
 */
const deriveMUK = function (dataProvider, passphrase) {
  const password = passphrase.trim().normalize(UNICODE_NORMALIZATION_FORM)

  const secret = dataProvider.seed
  let salt = dataProvider.salt

  salt = hkdf(salt, 32, { hash: 'SHA-256' })

  let kA = hkdf(secret, 32, { salt: salt, hash: 'SHA-256' })
  let kM = pbkdf2.pbkdf2Sync(password, salt, 100000, 32, 'sha512')

  kM = xor(kA, kM)

  return kM
}

export default {
  encrypt: (plaintext, publicKey) => {
    const key = new NodeRSA(publicKey)
    return key.encrypt(plaintext, 'base64', 'utf8')
  },
  decrypt: (encryptedText, privateKey) => {
    const key = new NodeRSA(privateKey)
    return key.decrypt(encryptedText, 'utf8')
  },
  generateUnlockKey: (userData, passphrase) => {
    let dataProvider = {
      salt: userData.salt.trim(),
      seed: userData.seed.trim(),
    }

    return deriveMUK(dataProvider, passphrase)
  },
  generateAccountKeys: () => {
    const key = new NodeRSA({ b: 512 })
    key.generateKeyPair(2048, 65537)

    return {
      publicKey: key.exportKey('pkcs8-public-pem'),
      privateKey: key.exportKey('pkcs8-private-pem')
    }
  },
  unlock: (encryptedHex, key) => {
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
    const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
    const decryptedBytes = aesCtr.decrypt(encryptedBytes)

    return aesjs.utils.utf8.fromBytes(decryptedBytes)
  },
  lock: (plainPrivateKey, key) => {
    const textBytes = aesjs.utils.utf8.toBytes(plainPrivateKey)

    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
    const encryptedBytes = aesCtr.encrypt(textBytes)

    return aesjs.utils.hex.fromBytes(encryptedBytes)
  }
}

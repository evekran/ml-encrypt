import { Buffer } from 'buffer'

const ENCODING = 'base64'

export default {
  serializeObject: (jsObject) => {
    if (typeof jsObject !== 'object' || jsObject == null) {
      throw new Error('Invalid input - serializer only supports objects')
    }

    const json = JSON.stringify(jsObject)

    return Buffer.from(json).toString(ENCODING)
  },
  deserialize: (base64encodedString) => {
    const json = Buffer.from(base64encodedString, ENCODING).toString()

    try {
      return JSON.parse(json)
    } catch (e) {
      throw new Error('Invalid input - string must be valid base64 encoded json')
    }
  }
}

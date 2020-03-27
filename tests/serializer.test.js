import serializer from '../src/serializer'

const invalidInputError = new Error('Invalid input - serializer only supports objects')

const input = {
  id: 1,
  email: 'example@example.com',
  seed: 'ABCDEF1234567890'
}

const output = 'eyJpZCI6MSwiZW1haWwiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwic2VlZCI6IkFCQ0RFRjEyMzQ1Njc4OTAifQ=='

test('Serializing object into string', () => {
  expect(serializer.serializeObject(input)).toBe(output)
})

test('Serializing invalid object into string', () => {
  const invalidInput = 'NOT A JS OBJECT'
  expect(() => {
    serializer.serializeObject(invalidInput)
  }).toThrow(invalidInputError)
})

test('Serializing null into string', () => {
  expect(() => {
    serializer.serializeObject(null)
  }).toThrow(invalidInputError)
})

const invalidOutputError = new Error('Invalid input - string must be valid base64 encoded json');

test('Deserializing invalid string into object', () => {
  const invalidOutput = 'J05PVCBBIE'
  expect(() => {
    serializer.deserialize(invalidOutput)
  }).toThrow(invalidOutputError)
})

test('Deserializing string with invalid json into object', () => {
  const invalidOutput = 'J05PVCBBIEJBU0U2NCBFTkNPREVEIFNUUklORyc='
  expect(() => {
    serializer.deserialize(invalidOutput)
  }).toThrow(invalidOutputError)
})

test('Deserializing string into object', () => {
  expect(serializer.deserialize(output)).toStrictEqual(input)
})



# E2E Encryption utility
Version `0.1.0`

## API
`generateUnlockKey` - Generates unlock key (MUK) to on successful auth
 
`generateAccountKeys` - Generate RSA key pair for data encryption 
 
`lock` - Encrypt RSA Private key with MUK
 
`unlock` - Decrypt RSA Private key with MUK
 
`encrypt` - Encrypt document with RSA Public Key
  
`decrypt` - Decrypt document with RSA Private Key

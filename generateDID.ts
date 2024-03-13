import { randomBytes } from '@stablelib/random'

import { Ed25519Provider } from 'key-did-provider-ed25519'
import KeyResolver from 'key-did-resolver'
import { DID } from 'dids'

import { KeyPair, generateKeyPairFromSeed, extractPublicKeyFromSecretKey } from '@stablelib/ed25519'

async function generateDid() {
  let seed_array = randomBytes(32)
  const seed = new Uint8Array(seed_array) //  32 bytes with high entropy
  //   let kp = generateKeyPairFromSeed(seed_array)

  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver: KeyResolver.getResolver() })
  await did.authenticate()

  // log the DID
  console.log('did is ', did.id)

  // create JWS
  const { jws, linkedBlock } = await did.createDagJWS({ hello: 'world' })

  // verify JWS
  await did.verifyJWS(jws)
}
generateDid()

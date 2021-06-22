//import { createHash, randomBytes } from 'crypto'
import { randomBytes } from 'react-native-randombytes'
import { sha256 } from 'react-native-sha256'
/**
 * Generates code challenge and verifier for PKCE authorize request
 */
export const pkceAuthorizeParams = async (): Promise<{ codeVerifier: string; codeChallenge: string; stateParam: string }> => {
  const verifier = base64URLEncode(randomBytes(32))
  const challenge = base64URLEncode(await sha256(verifier))
  const state = base64URLEncode(randomBytes(32))
  return {
    codeVerifier: verifier,
    codeChallenge: challenge,
    stateParam: state,
  }
}

export const pkceTokenParams = (): { stateParam: string } => {
  return {
    stateParam: base64URLEncode(randomBytes(32)),
  }
}

function base64URLEncode(input: string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '')
}

//function sha256(input: string): Buffer {
//  return createHash('sha256').update(input).digest()
//}

import { sha256 } from 'react-native-sha256'

/**
 * Generates code challenge, verifier, and state for PKCE authorize request
 */
export const pkceAuthorizeParams = async (): Promise<{ codeVerifier: string; codeChallenge: string; stateParam: string }> => {
  // TODO Replace fixed values with random bytes
  const verifier = base64URLEncode('VjrETNCWhIidNHkTwXDyflcj0fHoc/lzJ1fC7xhVVfA=')
  const challenge = base64URLEncode(await sha256(verifier))
  const state = base64URLEncode('mcGMjyK/NrMLJlCq76zVsdY7gR3b29M85XBv+wT7rnI=')
  return {
    codeVerifier: verifier,
    codeChallenge: challenge,
    stateParam: state,
  }
}

/**
 * Generates state param for PKCE token exchange request
 */
export const pkceTokenParams = (): { stateParam: string } => {
  return {
    // TODO Replace fixed values with random bytes
    stateParam: base64URLEncode('5UD6pQQ+X1M0Xu9TSkIW2+0kEyDQo10RDV9G5lJEvGc='),
  }
}

function base64URLEncode(input: Uint8Array | string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '')
}

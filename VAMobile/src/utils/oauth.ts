import { generateBase64, generateSHA256String } from './rnSecureRandom'

export type PKCEParameters = {
  codeVerifier: string
  codeChallenge: string
  stateParam: string
}

/**
 * Generates code challenge, verifier, and state for PKCE authorize request
 */
export const pkceAuthorizeParams = async (): Promise<PKCEParameters> => {
  const verifier = urlEncode(await generateBase64(32))
  const challenge = await generateSHA256String(verifier)
  const state = await generateBase64(32)
  return {
    codeVerifier: verifier,
    codeChallenge: urlEncode(challenge),
    stateParam: urlEncode(state),
  }
}

/**
 * Generates state param for PKCE token exchange request
 * Omitting this for now as OAuth spec doesn't describe using the state parameter on token requests
 */
// export const pkceTokenParams = async (): Promise<{ stateParam: string }> => {
//   return {
//     stateParam: urlEncode(await generateBase64(32) || '')
//   }
// }

/**
 * Makes input (expected to be base64 encoded) into URL-safe version by replacing plus and slash
 * characters and removing padding.
 */
function urlEncode(input: string): string {
  return input.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '')
}

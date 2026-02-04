import { generateBase64, generateSHA256String } from 'utils/rnSecureRandom'

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
  const params = {
    codeVerifier: verifier,
    codeChallenge: urlEncode(challenge),
    stateParam: urlEncode(state),
  }
  console.debug('pkceAuthorizeParams: GENERATED PARAMS', params)
  return params
}

/**
 * Makes input (expected to be base64 encoded) into URL-safe version by replacing plus and slash
 * characters and removing padding.
 */
function urlEncode(input: string): string {
  return input.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '').replace(/\n|\r/g, '')
}

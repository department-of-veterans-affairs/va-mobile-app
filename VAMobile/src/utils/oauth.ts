import { generateBase64, generateSHA256String } from 'utils/rnSecureRandom'

export type PKCEParameters = {
  codeVerifier: string
  codeChallenge: string
}

/**
 * Generates code challenge and verifier for PKCE authorize request.
 *
 * Note: The OAuth `state` parameter is intentionally omitted. PKCE with S256
 * already prevents authorization code injection (the primary threat `state`
 * mitigates). As a native mobile app using a custom URI scheme callback,
 * cross-site request context does not apply the way it does for web apps.
 * The SIS (Sign-in Service) backend does not require or validate `state`.
 */
export const pkceAuthorizeParams = async (): Promise<PKCEParameters> => {
  const verifier = urlEncode(await generateBase64(32))
  const challenge = await generateSHA256String(verifier)
  return {
    codeVerifier: verifier,
    codeChallenge: urlEncode(challenge),
  }
}

/**
 * Makes input (expected to be base64 encoded) into URL-safe version by replacing plus and slash
 * characters and removing padding.
 */
function urlEncode(input: string): string {
  return input.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '').replace(/\n|\r/g, '')
}

import { NativeModules } from 'react-native'

const RnSecureRandom = NativeModules.RNSecureRandom

/**
 * function calls the secure random libraries in the OS, creates a randomized byte array and transforms the array into
 * a base64 encoded string.
 * @param count- number of bytes to generate into base64 string
 */
export const generateBase64 = async (count: number): Promise<string | undefined> => {
  try {
    return await RnSecureRandom.generateBase64(count)
  } catch (e) {
    console.log(e)
    return undefined
  }
}
/**
 * Takes a string, hashes it with SHA256 and returns a base64 string of that hash
 * @param string- string to SHA256 hash at the OS level
 */
export const generateSHA256String = async (string: string): Promise<string | undefined> => {
  try {
    return await RnSecureRandom.generateSHA256String(string)
  } catch (e) {
    console.log(e)
    return undefined
  }
}

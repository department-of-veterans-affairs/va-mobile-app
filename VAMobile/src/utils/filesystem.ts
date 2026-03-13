import { Platform } from 'react-native'
import ReactNativeBlobUtil, { ReactNativeBlobUtilConfig } from 'react-native-blob-util'

import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Params, getAccessToken, getRefreshToken } from 'store/api'
import { refreshAccessToken } from 'store/slices/authSlice'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

const DocumentDirectoryPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/`
const DownloadDirectoryPath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/`

// TODO: verify this time on the service side and match
const FETCH_TIMEOUT_MS = 60000

const fileSystemFatalErrorString = 'File System Error'

/**
 * writes to file local filesystem for each mobile platform
 * @param method - string type of call
 * @param endpoint - string endpoint to retrieve data
 * @param fileName - string name of the file
 * @param params - body for the call
 * @param retries - number of times to attempt the request again until it fails
 * @returns Returns a Promise with a string that represents the filePath or undefined for a failed download
 */
export const downloadFile = async (
  method: 'GET' | 'POST',
  endpoint: string,
  fileName: string,
  params: Params = {},
  retries = 0,
): Promise<string | undefined> => {
  const filePath = DocumentDirectoryPath + fileName

  try {
    const options: ReactNativeBlobUtilConfig = {
      fileCache: true,
      path: filePath,
      timeout: FETCH_TIMEOUT_MS,
    }

    const headers = {
      authorization: `Bearer ${getAccessToken()}`,
      'X-Key-Inflection': 'camel',
      'Authentication-Method': 'SIS',
    }

    // https://github.com/RonRadtke/react-native-blob-util/wiki/api#bodystring--arrayobject-optional
    const body = JSON.stringify(params)
    const results = await ReactNativeBlobUtil.config(options).fetch(method, endpoint, headers, body)
    const statusCode = results.respInfo.status
    let accessTokenExpired = false

    // a 403 alone doesn't indicated an expired access token. We need to check for the error message as well.
    if (statusCode === 403) {
      const responseBody = await results.json()
      if (responseBody?.errors === 'Access token has expired') {
        accessTokenExpired = true
      }
    }

    // Unauthorized, access-token likely expired
    // TODO: add analytics here to capture failed attempts
    if (accessTokenExpired && retries > 0) {
      // refresh auth token and re-download
      await refreshAccessToken(getRefreshToken() || '')
      return await downloadFile(method, endpoint, fileName, params, retries - 1)
    }

    if (statusCode > 399) {
      throw new Error(`Response error code ${statusCode}`)
    }

    return filePath
  } catch (e) {
    if (retries > 0) {
      try {
        return await downloadFile(method, endpoint, fileName, params, retries - 1)
      } catch (error) {
        throw error
      }
    }
    logNonFatalErrorToFirebase(e, `downloadFile: ${fileSystemFatalErrorString} retries ${retries}`)
    console.error(`Error downloading letter: ${e}`)
    /**
     * On a request failure/timeout we get an exception thrown so we don't assume this is a network error
     */
    throw e
  }
}

/**
 * writes to file local filesystem for each mobile platform, only used for demo mode letters
 * @param endpoint - string endpoint to retrieve data
 * @param fileName - string name of the file
 * @param params - body for the call
 * @returns Returns the filePath
 */
export const downloadDemoFile = async (
  endpoint: string,
  fileName: string,
  params: Params = {},
): Promise<string | undefined> => {
  const filePath = DocumentDirectoryPath + fileName

  const options: ReactNativeBlobUtilConfig = {
    fileCache: true,
    path: filePath,
    timeout: FETCH_TIMEOUT_MS,
  }

  const headers = {}

  const body = JSON.stringify(params)
  await ReactNativeBlobUtil.config(options).fetch('GET', endpoint, headers, body)

  return filePath
}

// Unlinking is the same as deleting in this case
export const unlinkFile = async (filePath: string): Promise<void> => {
  await ReactNativeBlobUtil.fs.unlink(filePath)
}

/**
 * Gets the base64 string for a given file.
 */
export const getBase64ForUri = async (uri: string): Promise<string | undefined> => {
  // TODO: this is not currently used but will be used for the multi upload flow
  // Documents from the document picker sometimes are prepended with file:// which
  // ReactNativeBlobUtil is not expecting
  const filePrefix = 'file://'
  if (uri.startsWith(filePrefix)) {
    uri = uri.substring(filePrefix.length)
    try {
      uri = decodeURI(uri)
    } catch (e) {
      logNonFatalErrorToFirebase(e, `getBase64ForUri: ${fileSystemFatalErrorString}`)
    }
  }

  return await ReactNativeBlobUtil.fs.readFile(uri, 'base64')
}

/**
 * Gets the UInt8Array from a base64 string
 */
export const getUInt8ArrayForBase64 = (base64Str: string) => {
  const binaryString = ReactNativeBlobUtil.base64.decode(base64Str) // decode to binary string
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return Array.from(bytes)
}

/**
 * Find if an array of fixed length is nested within a variable-sized array
 * Logic is based on vets-website file utility function arrayIncludesArray
 * @param variableArray - array of variable size (file)
 * @param fixedArray - array of fixed size (signature)
 */
export const arrayIncludesArray = (variableArray: number[], fixedArray: number[]) => {
  if (
    !Array.isArray(variableArray) ||
    variableArray.length === 0 ||
    !Array.isArray(fixedArray) ||
    fixedArray.length === 0
  ) {
    return false
  }

  // Skip expensive check if possible
  // If variableArray does not contain the first index of fixedArray, skip the check & return false
  // Otherwise, do logic check to see if variable array contains the fixed array
  const startIndex = variableArray.indexOf(fixedArray[0])
  return startIndex < 0
    ? false
    : variableArray.some((_, variableIndex) => {
        // docx sig isn't near the beginning of the file
        if (variableIndex < startIndex) {
          return false
        }
        return fixedArray.every(
          (fixedElement, fixedIndex) => fixedElement === variableArray[variableIndex + fixedIndex],
        )
      })
}

/**
 * Checks if a file is a PDF, then looks for the encrypted PDF signature
 * within the file content. The "/Encrypt" signature is also added to view-only
 * PDFs as well as password-encrypted PDF files
 * Logic is based on vets-website file utility function checkIsEncryptedPdf
 * @param document - DocumentPickerResponse file document
 */
export const isPdfEncrypted = async (document: DocumentPickerResponse): Promise<boolean> => {
  const base64String = await getBase64ForUri(document.uri)
  const pdfTypes = ['pdf', 'application/pdf', 'com.adobe.pdf']
  if (!base64String || !pdfTypes.includes(document.type)) {
    return false
  }
  const bytes = getUInt8ArrayForBase64(base64String)
  // Evaluates to an array of numbers representing the Unicode code points of the characters
  // Returns Unicode value [47, 69, 110, 99, 114, 121, 112, 116]
  const encryptSig = [...'/Encrypt'].map((str) => str.charCodeAt(0))
  return arrayIncludesArray(bytes, encryptSig)
}

// Via MDN web docs to support base64 validation and conversion just in case we get UTF-8 data
// https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa#unicode_strings
export function base64ToBytes(base64: string) {
  const binString = atob(base64)
  return Uint8Array.from(binString, (m, _) => m.codePointAt(0)!)
}

export function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('')
  return btoa(binString)
}

// Validates if a string is valid base64 data - handles either UTF-8 or ASCII base64 strings
export const isValidBase64 = (base64String: string): boolean => {
  // Checks valid base 64 data
  try {
    if (bytesToBase64(base64ToBytes(base64String)) === base64String) return true
  } catch (e) {
    return false
  }
  return false
}

// Creates a file from a base64 string and returns the file path - generally used for PDFs from appointments e.g. avsPdf
export const createFileFromBase64 = async (base64String: string, fileName: string): Promise<string> => {
  const basePath = Platform.OS === 'ios' ? DocumentDirectoryPath : DownloadDirectoryPath
  const filePath = basePath + fileName
  await ReactNativeBlobUtil.fs.writeFile(filePath, base64String, 'base64')
  return filePath
}

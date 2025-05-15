import ReactNativeBlobUtil, { ReactNativeBlobUtilConfig } from 'react-native-blob-util'

import { refreshAccessToken } from 'store/slices/authSlice'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

import { Params, getAccessToken, getRefreshToken } from '../store/api'

const DocumentDirectoryPath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/`

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
 * @param uri - Uri string of the file
 */
export const isPdfEncrypted = async (uri: string): Promise<boolean> => {
  const base64String = await getBase64ForUri(uri)
  if (!base64String) {
    return false
  }
  const bytes = getUInt8ArrayForBase64(base64String)
  const encryptSig = [...'/Encrypt'].map((str) => str.charCodeAt(0))
  return arrayIncludesArray(bytes, encryptSig)
}

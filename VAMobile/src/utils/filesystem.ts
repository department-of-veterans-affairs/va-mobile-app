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
 * Get's the base64 string for a given file.
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

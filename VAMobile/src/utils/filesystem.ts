import { Params, getAccessToken, getRefreshToken } from '../store/api'
import { refreshAccessToken } from '../store/actions'
import RNFetchBlob, { FetchBlobResponse, RNFetchBlobConfig } from 'rn-fetch-blob'

const DocumentDirectoryPath = `${RNFetchBlob.fs.dirs.DocumentDir}/`

// TODO: verify this time on the service side and match
const FETCH_TIMEOUT_MS = 60000

/**
 * writes to file local filesystem for each mobile platform
 * @param method - string type of call
 * @param endpoint - string endpoint to retrieve data
 * @param fileName - string name of the file
 * @param params - body for the call
 * @param retries - number of times to attempt the request again until it fails
 * @returns Returns a Promise with a string that represents the filePath or undefined for a failed download
 */
export const downloadFile = async (method: 'GET' | 'POST', endpoint: string, fileName: string, params: Params = {}, retries = 0): Promise<string | undefined> => {
  const filePath = DocumentDirectoryPath + fileName

  try {
    const options: RNFetchBlobConfig = {
      fileCache: true,
      path: filePath,
      timeout: FETCH_TIMEOUT_MS,
    }

    const headers = {
      authorization: `Bearer ${getAccessToken()}`,
      'X-Key-Inflection': 'camel',
    }

    // https://github.com/joltup/rn-fetch-blob/wiki/Fetch-API#bodystring--arrayobject-optional
    const body = JSON.stringify(params)
    const results: FetchBlobResponse = await RNFetchBlob.config(options).fetch(method, endpoint, headers, body)

    // Unauthorized, access-token likely expired
    // TODO: add analytics here to capture failed attempts
    if (results.respInfo.status === 401 && retries > 0) {
      // refresh auth token and re-download
      await refreshAccessToken(getRefreshToken() || '')
      return await downloadFile(method, endpoint, fileName, params, retries - 1)
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

    console.error(`Error downloading letter: ${e}`)
    /**
     * On a request failure/timeout we get an exception thrown so we don't assume this is a network error
     */
    throw e
  }
}

export const getBase64ForUri = async (uri: string): Promise<string | undefined> => {
  // Documents from the document picker sometimes are prepended with file:// which RNFetchBlob is not expecting
  const filePrefix = 'file://'
  if (uri.startsWith(filePrefix)) {
    uri = uri.substring(filePrefix.length)
    try {
      uri = decodeURI(uri)
    } catch (e) {}
  }

  console.log(uri)
  const fileStr = await RNFetchBlob.fs.readFile(uri, 'base64')
  console.log(fileStr)
  return fileStr
}

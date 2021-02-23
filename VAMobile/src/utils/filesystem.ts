import { Params, getAccessToken } from '../store/api'
import RNFetchBlob, { RNFetchBlobConfig } from 'rn-fetch-blob'

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
    await RNFetchBlob.config(options).fetch(method, endpoint, headers, body)
    return filePath
  } catch (e) {
    if (retries > 0) {
      try {
        return await downloadFile(method, endpoint, fileName, params, retries - 1)
      } catch (error) {
        throw e
      }
    }

    console.error(`Error downloading letter: ${e}`)
    /**
     * On a request failure/timeout we get an exception thrown so we don't assume this is a network error
     */
    throw e
  }
}

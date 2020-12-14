import { Params, getAccessToken } from '../store/api'
import RNFetchBlob, { RNFetchBlobConfig } from 'rn-fetch-blob'

const DocumentDirectoryPath = `${RNFetchBlob.fs.dirs.DocumentDir}/`

/**
 * writes to file local filesystem for each mobile platform
 * @param method - string type of call
 * @param endpoint - string endpoint to retrieve data
 * @param fileName - string name of the file
 * @param params - body for the call
 * @returns Returns a Promise with a string that represents the filePath or undefined for a failed download
 */
export const downloadFile = async (method: 'GET' | 'POST', endpoint: string, fileName: string, params: Params = {}): Promise<string | undefined> => {
  const filePath = DocumentDirectoryPath + fileName

  try {
    const options: RNFetchBlobConfig = {
      fileCache: true,
      path: filePath,
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
    console.log(e)
  }
}

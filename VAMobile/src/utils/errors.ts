import { APIError } from 'store/api'
import { CommonErrorTypes, CommonErrorTypesConstants } from 'constants/errors'
import { flatten, includes, map } from 'lodash'

export const getErrorKeys = (error: APIError): (string | undefined)[] => {
  if (!error) {
    return []
  }
  const errors = error?.json?.errors
  const messages = flatten(map(errors, (err) => err?.meta?.messages))
  return map(messages, (message) => message?.key)
}

const appLevelErrorStatusCodes: number[] = [404, 500, 502]
const appLevelErrorWithRefreshStatusCodes: number[] = [408, 503, 504]
const appLevelErrorLoadingMessagesCodes: string[] = ['SM900', 'SM901', 'SM903', 'SM99']

export const getCommonErrorFromAPIError = (error: APIError): CommonErrorTypes | undefined => {
  if (error.networkError) {
    return CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR
  } else if (error.json?.errors && error.json.errors.some((err) => appLevelErrorLoadingMessagesCodes.indexOf(err.code) > -1)) {
    return CommonErrorTypesConstants.APP_LEVEL_ERROR_LOAD_MESSAGES
  } else if (includes(appLevelErrorStatusCodes, error.status)) {
    return CommonErrorTypesConstants.APP_LEVEL_ERROR
  } else if (includes(appLevelErrorWithRefreshStatusCodes, error.status)) {
    return CommonErrorTypesConstants.APP_LEVEL_ERROR_WITH_REFRESH
  }
}

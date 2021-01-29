import { APIError } from 'store/api'
import { CommonErrorTypes, CommonErrors } from 'constants/errors'
import { flatten, map } from 'lodash'

export const getErrorKeys = (error: APIError): (string | undefined)[] => {
  if (!error) {
    return []
  }
  const errors = error?.json?.errors
  const messages = flatten(map(errors, (err) => err?.meta?.messages))
  return map(messages, (message) => message?.key)
}

export const getCommonErrorFromAPIError = (error: APIError): CommonErrorTypes | undefined => {
  if (error.networkError) {
    return CommonErrors.NETWORK_CONNECTION_ERROR
  }
}

import { APIError, DowntimeFeatureType, ScreenIDTypes, ScreenIDTypesConstants } from 'store/api/types'
import { CommonErrorTypes, CommonErrorTypesConstants } from 'constants/errors'
import { DateTime } from 'luxon'
import { DowntimeWindowsByFeatureType } from 'store'
import { flatten, includes, map, some } from 'lodash'

export const getErrorKeys = (error: APIError): (string | undefined)[] => {
  if (!error) {
    return []
  }
  const errors = error?.json?.errors
  const messages = flatten(map(errors, (err) => err?.meta?.messages))
  return map(messages, (message) => message?.key)
}

export const hasErrorCode = (errorCode: string, error?: APIError): boolean => {
  if (!error) {
    return false
  }
  const errors = error?.json?.errors
  return some(errors, (err) => err?.code === errorCode)
}

const appLevelErrorStatusCodes: number[] = [404, 500, 502]
const appLevelErrorWithRefreshStatusCodes: number[] = [408, 503, 504]
const appLevelErrorLoadingMessagesCodes: string[] = ['SM900', 'SM901', 'SM903', 'SM99']
const healthErrorPageList = [ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID]

export const getCommonErrorFromAPIError = (error: APIError, screenID?: ScreenIDTypes): CommonErrorTypes | undefined => {
  if (error.networkError) {
    return CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR
  } else if (
    // Check error code to see if the error is specifically a loading message error
    // Or check it's from secure messaging and has status >= 500.
    error.json?.errors?.some((err) => appLevelErrorLoadingMessagesCodes.indexOf(err.code) > -1) ||
    (screenID && healthErrorPageList.includes(screenID) && error.status && error.status >= 500)
  ) {
    return CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD
  } else if (screenID === ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID && error.status && error.status >= 500) {
    return CommonErrorTypesConstants.APP_LEVEL_ERROR_VACCINE
  } else if (screenID === ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID && error.status && error.status >= 500) {
    return CommonErrorTypesConstants.APP_LEVEL_ERROR_DISABILITY_RATING
  } else if (includes(appLevelErrorStatusCodes, error.status)) {
    return CommonErrorTypesConstants.APP_LEVEL_ERROR
  } else if (includes(appLevelErrorWithRefreshStatusCodes, error.status)) {
    return CommonErrorTypesConstants.APP_LEVEL_ERROR_WITH_REFRESH
  }
}

export const isInDowntime = (feature: DowntimeFeatureType, downtimeWindows: DowntimeWindowsByFeatureType): boolean => {
  const mw = downtimeWindows[feature]
  if (!!mw && mw.startTime <= DateTime.now() && DateTime.now() <= mw.endTime) {
    return true
  }
  return false
}

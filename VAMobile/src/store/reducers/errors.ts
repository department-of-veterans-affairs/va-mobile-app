import { CommonErrorTypes, CommonErrorTypesConstants } from 'constants/errors'
import { DateTime } from 'luxon'
import { ScreenIDTypes } from '../api'
import { ScreenIDTypesConstants } from '../api/types/Screens'
import { reduce } from 'underscore'
import createReducer from './createReducer'

export type ErrorsByScreenIDType = {
  [key in ScreenIDTypes]?: CommonErrorTypes
}

export type DowntimeWindowsByScreenIDType = {
  [key in ScreenIDTypes]?: DowntimeWindow
}

export type DowntimeWindow = {
  featureName: string
  startTime: DateTime
  endTime: DateTime
}

export type ErrorsState = {
  errorsByScreenID: ErrorsByScreenIDType
  downtimeWindowsByScreenID: DowntimeWindowsByScreenIDType
  tryAgain: () => Promise<void>
}

export const initializeErrorsByScreenID = (): ErrorsByScreenIDType => {
  return reduce(
    ScreenIDTypesConstants,
    (memo: ErrorsByScreenIDType, value: ScreenIDTypes): ErrorsByScreenIDType => {
      memo[value] = undefined
      return memo
    },
    {} as ErrorsByScreenIDType,
  )
}

export const initializeDowntimeWindowsByScreenID = (): DowntimeWindowsByScreenIDType => {
  return reduce(
    ScreenIDTypesConstants,
    (memo: DowntimeWindowsByScreenIDType, value: ScreenIDTypes): DowntimeWindowsByScreenIDType => {
      memo[value] = undefined
      return memo
    },
    {} as DowntimeWindowsByScreenIDType,
  )
}

export const initialErrorsState: ErrorsState = {
  tryAgain: () => Promise.resolve(),
  errorsByScreenID: initializeErrorsByScreenID(),
  downtimeWindowsByScreenID: initializeDowntimeWindowsByScreenID(),
}

export default createReducer<ErrorsState>(initialErrorsState, {
  ERRORS_SET_ERROR: (state, { errorType, screenID }) => {
    const errorsByScreenID = !screenID
      ? state.errorsByScreenID
      : {
          ...state.errorsByScreenID,
          [screenID as ScreenIDTypes]: errorType,
        }
    return {
      ...state,
      errorsByScreenID,
    }
  },
  ERRORS_SET_ERRORS: (state, { errors }) => {
    const errorsByScreenID = errors
    return {
      ...state,
      errorsByScreenID,
    }
  },
  ERRORS_CLEAR_ERRORS: (state, { screenID }) => {
    const downtimeWindowsByScreenID = state.downtimeWindowsByScreenID
    const errorsByScreenID = !screenID
      ? state.errorsByScreenID
      : {
          ...state.errorsByScreenID,
          [screenID as ScreenIDTypes]: state.errorsByScreenID[screenID] === CommonErrorTypesConstants.DOWNTIME_ERROR ? CommonErrorTypesConstants.DOWNTIME_ERROR : undefined,
        }
    return {
      ...initialErrorsState,
      errorsByScreenID,
      downtimeWindowsByScreenID,
    }
  },
  ERRORS_SET_DOWNTIME: (state, { downtimeWindows }) => {
    const downtimeWindowsByScreenID = downtimeWindows
    return {
      ...state,
      downtimeWindowsByScreenID,
    }
  },
  ERRORS_CLEAR_DOWNTIME: (state, { screenID }) => {
    const downtimeWindowsByScreenID = !screenID
      ? state.downtimeWindowsByScreenID
      : {
          ...state.downtimeWindowsByScreenID,
          [screenID as ScreenIDTypes]: undefined,
        }
    return {
      ...state,
      downtimeWindowsByScreenID,
    }
  },
  ERRORS_CLEAR_ALL_DOWNTIME: (state) => {
    let downtimeWindowsByScreenID = state.downtimeWindowsByScreenID
    for (const screenID in ScreenIDTypesConstants) {
      downtimeWindowsByScreenID = {
        ...state.downtimeWindowsByScreenID,
        [screenID as ScreenIDTypes]: undefined,
      }
    }
    return {
      ...state,
      downtimeWindowsByScreenID,
    }
  },
  ERRORS_CLEAR_ERROR_TYPE: (state, { errorType }) => {
    let errorsByScreenID = state.errorsByScreenID
    errorsByScreenID = reduce(
      ScreenIDTypesConstants,
      (memo: ErrorsByScreenIDType, value: ScreenIDTypes): ErrorsByScreenIDType => {
        memo[value] = errorsByScreenID[value] === errorType ? undefined : errorsByScreenID[value]
        return memo
      },
      {} as ErrorsByScreenIDType,
    )
    return {
      ...state,
      errorsByScreenID,
    }
  },
  ERRORS_CLEAR_ERROR_TYPE_BY_SCREEN: (state, { errorType, screenID }) => {
    const error = state.errorsByScreenID[screenID]
    const errorsByScreenID = {
      ...state.errorsByScreenID,
      [screenID as ScreenIDTypes]: error === errorType ? undefined : error,
    }
    const downtimeWindowsByScreenID = {
      ...state.downtimeWindowsByScreenID,
      [screenID as ScreenIDTypes]: error === errorType ? undefined : state.downtimeWindowsByScreenID[screenID],
    }
    return {
      ...state,
      errorsByScreenID,
      downtimeWindowsByScreenID,
    }
  },
  ERRORS_SET_TRY_AGAIN_FUNCTION: (state, { tryAgain }) => {
    return {
      ...state,
      tryAgain,
    }
  },
})

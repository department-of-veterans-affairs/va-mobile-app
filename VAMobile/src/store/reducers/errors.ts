import { CommonErrorTypes, CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypes } from '../api'
import { ScreenIDTypesConstants } from '../api/types/Screens'
import { reduce } from 'underscore'
import createReducer from './createReducer'

export type ErrorsByScreenIDType = {
  [key in ScreenIDTypes]?: CommonErrorTypes
}

export type ErrorMetadataByScreenIDType = {
  [key in ScreenIDTypes]?: {
    [key: string]: string
  }
}

export type ErrorsState = {
  errorsByScreenID: ErrorsByScreenIDType
  errorMetadataByScreenID: ErrorMetadataByScreenIDType
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

export const initializeErrorMetadataByScreenID = (): ErrorMetadataByScreenIDType => {
  return reduce(
    ScreenIDTypesConstants,
    (memo: ErrorMetadataByScreenIDType, value: ScreenIDTypes): ErrorMetadataByScreenIDType => {
      memo[value] = undefined
      return memo
    },
    {} as ErrorMetadataByScreenIDType,
  )
}

export const initialErrorsState: ErrorsState = {
  tryAgain: () => Promise.resolve(),
  errorsByScreenID: initializeErrorsByScreenID(),
  errorMetadataByScreenID: initializeErrorMetadataByScreenID(),
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
  ERRORS_CLEAR_ERRORS: (state, { screenID }) => {
    const errorMetadataByScreenID = state.errorMetadataByScreenID
    const errorsByScreenID = !screenID
      ? state.errorsByScreenID
      : {
          ...state.errorsByScreenID,
          [screenID as ScreenIDTypes]: state.errorsByScreenID[screenID] === CommonErrorTypesConstants.DOWNTIME_ERROR ? CommonErrorTypesConstants.DOWNTIME_ERROR : undefined,
        }
    return {
      ...initialErrorsState,
      errorsByScreenID,
      errorMetadataByScreenID,
    }
  },
  ERRORS_SET_METADATA: (state, { metadata, screenID }) => {
    const errorMetadataByScreenID = !screenID
      ? state.errorMetadataByScreenID
      : {
          ...state.errorMetadataByScreenID,
          [screenID as ScreenIDTypes]: metadata,
        }
    return {
      ...state,
      errorMetadataByScreenID,
    }
  },
  ERRORS_CLEAR_METADATA: (state, { screenID }) => {
    const errorMetadataByScreenID = !screenID
      ? state.errorMetadataByScreenID
      : {
          ...state.errorMetadataByScreenID,
          [screenID as ScreenIDTypes]: undefined,
        }
    return {
      ...state,
      errorMetadataByScreenID,
    }
  },
  ERRORS_CLEAR_ALL_METADATA: (state) => {
    let errorMetadataByScreenID = state.errorMetadataByScreenID
    for (const screenID in ScreenIDTypesConstants) {
      errorMetadataByScreenID = {
        ...state.errorMetadataByScreenID,
        [screenID as ScreenIDTypes]: undefined,
      }
    }
    return {
      ...state,
      errorMetadataByScreenID,
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
  ERRORS_SET_METADATA: (state, { metadata, screenID }) => {
    const errorMetadataByScreenID = !screenID
      ? state.errorMetadataByScreenID
      : {
          ...state.errorMetadataByScreenID,
          [screenID as ScreenIDTypes]: metadata,
        }
    return {
      ...state,
      errorMetadataByScreenID,
    }
  },
  ERRORS_CLEAR_METADATA: (state, { screenID }) => {
    const errorMetadataByScreenID = !screenID
      ? state.errorMetadataByScreenID
      : {
          ...state.errorMetadataByScreenID,
          [screenID as ScreenIDTypes]: undefined,
        }
    return {
      ...state,
      errorMetadataByScreenID,
    }
  },
  ERRORS_CLEAR_ALL_METADATA: (state) => {
    let errorMetadataByScreenID = state.errorMetadataByScreenID
    for (const screenID in ScreenIDTypesConstants) {
      errorMetadataByScreenID = {
        ...state.errorMetadataByScreenID,
        [screenID as ScreenIDTypes]: undefined,
      }
    }
    return {
      ...state,
      errorMetadataByScreenID,
    }
  },
  ERRORS_SET_TRY_AGAIN_FUNCTION: (state, { tryAgain }) => {
    return {
      ...state,
      tryAgain,
    }
  },
})

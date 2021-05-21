import { CommonErrorTypes } from 'constants/errors'
import { ScreenIDTypes } from '../api'
import { ScreenIDTypesConstants } from '../api/types/Screens'
import { reduce } from 'underscore'
import createReducer from './createReducer'

export type ErrorsByScreenIDType = {
  [key in ScreenIDTypes]?: CommonErrorTypes
}

export type ErrorsState = {
  errorsByScreenID: ErrorsByScreenIDType
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

export const initialErrorsState: ErrorsState = {
  tryAgain: () => Promise.resolve(),
  errorsByScreenID: initializeErrorsByScreenID(),
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
    const errorsByScreenID = !screenID
      ? state.errorsByScreenID
      : {
          ...state.errorsByScreenID,
          [screenID as ScreenIDTypes]: undefined,
        }
    return {
      ...initialErrorsState,
      errorsByScreenID,
    }
  },
  ERRORS_SET_TRY_AGAIN_FUNCTION: (state, { tryAgain }) => {
    return {
      ...state,
      tryAgain,
    }
  },
})

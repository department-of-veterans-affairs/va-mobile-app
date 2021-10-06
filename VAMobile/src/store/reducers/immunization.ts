import * as api from '../api'
import createReducer from './createReducer'

export type ImmunizationState = {
  loading: boolean
  immunizations: api.ImmunizationList
}

export const initialImmunizationState = {
  loading: false,
  immunizations: [],
}

export default createReducer<ImmunizationState>(initialImmunizationState, {
  IMMUNIZATION_START_GET_IMMUNIZATIONS: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  IMMUNIZATION_FINISH_GET_IMMUNIZATIONS: (state, { immunizations, error }) => {
    return {
      ...state,
      loading: false,
      immunizations: immunizations || state.immunizations,
      error,
    }
  },
})

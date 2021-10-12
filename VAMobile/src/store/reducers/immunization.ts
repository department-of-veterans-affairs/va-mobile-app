import _ from 'underscore'

import * as api from '../api'
import createReducer from './createReducer'

export type ImmunizationState = {
  loading: boolean
  immunizations: api.ImmunizationList
  immunizationsById: api.ImmunizationsMap
}

export const initialImmunizationState = {
  loading: false,
  immunizations: [],
  immunizationsById: {},
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
    const immunizationsById = _.indexBy(immunizations || [], 'id')

    return {
      ...state,
      loading: false,
      immunizations: immunizations || [],
      immunizationsById,
      error,
    }
  },
})

import _ from 'underscore'

import * as api from '../api'
import createReducer from './createReducer'

export type VaccineState = {
  loading: boolean
  vaccines: api.VaccineList
  vaccinesById: api.VaccinesMap
}

export const initialVaccineState = {
  loading: false,
  vaccines: [],
  vaccinesById: {},
}

export default createReducer<VaccineState>(initialVaccineState, {
  VACCINE_START_GET_VACCINES: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  VACCINE_FINISH_GET_VACCINES: (state, { vaccines, error }) => {
    const vaccinesById = _.indexBy(vaccines || [], 'id')

    return {
      ...state,
      loading: false,
      vaccines: vaccines || [],
      vaccinesById,
      error,
    }
  },
})

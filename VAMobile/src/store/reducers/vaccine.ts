import { indexBy } from 'underscore'

import * as api from '../api'
import { compareDateStrings } from 'utils/common'
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
    const vaccinesById = indexBy(vaccines || [], 'id')

    const vaccineList = vaccines || []

    vaccineList.sort((a, b) => {
      return compareDateStrings(a.attributes?.date || '', b.attributes?.date || '', true)
    })

    return {
      ...state,
      loading: false,
      vaccines: vaccineList,
      vaccinesById,
      error,
    }
  },
})

import { indexBy } from 'underscore'

import * as api from '../api'
import { VaccineListData, VaccinePaginationMeta } from '../api'
import createReducer from './createReducer'

export type VaccineState = {
  loading: boolean
  vaccines: api.VaccineList
  vaccinesById: api.VaccinesMap
  vaccineLocationsById: api.VaccineLocationsMap
  detailsLoading: boolean
  vaccinePagination: VaccinePaginationMeta
}

export const initialVaccineState = {
  loading: false,
  detailsLoading: false,
  vaccines: [],
  vaccinesById: {},
  vaccineLocationsById: {},
  vaccinePagination: {} as VaccinePaginationMeta,
}

export default createReducer<VaccineState>(initialVaccineState, {
  VACCINE_START_GET_VACCINES: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  VACCINE_FINISH_GET_VACCINES: (state, { vaccinesData, error }) => {
    const { data: vaccines, meta } = vaccinesData || ({} as VaccineListData)
    const vaccinesById = indexBy(vaccines || [], 'id')

    const vaccineList = vaccines || []

    return {
      ...state,
      loading: false,
      vaccines: vaccineList,
      vaccinesById,
      vaccinePagination: { ...meta?.pagination },
      error,
    }
  },
  VACCINE_START_GET_LOCATION: (state) => {
    return {
      ...state,
      detailsLoading: true,
    }
  },
  VACCINE_FINISH_GET_LOCATION: (state, payload) => {
    const { vaccineId, location, error } = payload
    const locationMap = state.vaccineLocationsById

    if (!error && vaccineId && location) {
      locationMap[vaccineId] = location
    }

    return {
      ...state,
      detailsLoading: false,
      vaccineLocationsById: locationMap,
    }
  },
})

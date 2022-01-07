import { indexBy } from 'underscore'

import * as api from '../api'
import { VaccineListData, VaccinePaginationMeta } from '../api'
import createReducer from './createReducer'

export type VaccineListType = {
  [key in string]: VaccineListData
}

export type VaccineState = {
  loading: boolean
  vaccines: api.VaccineList
  vaccinesById: api.VaccinesMap
  vaccineLocationsById: api.VaccineLocationsMap
  detailsLoading: boolean
  vaccinePagination: VaccinePaginationMeta
  loadedVaccines: VaccineListType
}

export const initialVaccineState = {
  loading: false,
  detailsLoading: false,
  vaccines: [],
  vaccinesById: {},
  vaccineLocationsById: {},
  vaccinePagination: {} as VaccinePaginationMeta,
  loadedVaccines: {} as VaccineListType,
}

export default createReducer<VaccineState>(initialVaccineState, {
  VACCINE_START_GET_VACCINES: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  VACCINE_FINISH_GET_VACCINES: (state, { page, vaccinesData, error }) => {
    const { data: vaccines, meta } = vaccinesData || ({} as VaccineListData)
    const vaccinesById = indexBy(vaccines || [], 'id')

    const curLoadedVaccines = state.loadedVaccines[page.toString()]
    const vaccineList = vaccines || []

    return {
      ...state,
      loading: false,
      vaccines: vaccineList,
      vaccinesById,
      vaccinePagination: { ...meta?.pagination },
      error,
      loadedVaccines: {
        ...state.loadedVaccines,
        [page]: meta?.dataFromStore ? curLoadedVaccines : vaccinesData,
      },
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

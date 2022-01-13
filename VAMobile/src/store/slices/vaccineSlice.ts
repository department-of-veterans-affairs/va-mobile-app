import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as api from '../api'
import { APIError, ScreenIDTypes, VaccineList, VaccineListData, VaccineLocation, VaccineLocationData, VaccineLocationsMap, VaccinePaginationMeta, VaccinesMap } from '../api'
import { AppThunk } from 'store'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Events } from 'constants/analytics'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { indexBy } from 'underscore'
import { isErrorObject } from '../../utils/common'
import { logAnalyticsEvent } from 'utils/analytics'

export type VaccineListType = {
  [key in string]: VaccineListData
}

export type VaccineState = {
  loading: boolean
  vaccines: VaccineList
  vaccinesById: VaccinesMap
  vaccineLocationsById: VaccineLocationsMap
  detailsLoading: boolean
  vaccinePagination: VaccinePaginationMeta
  loadedVaccines: VaccineListType
  error?: api.APIError
}

export const initialVaccineState: VaccineState = {
  loading: false,
  detailsLoading: false,
  vaccines: [] as VaccineList,
  vaccinesById: {} as VaccinesMap,
  vaccineLocationsById: {} as VaccineLocationsMap,
  vaccinePagination: {} as VaccinePaginationMeta,
  loadedVaccines: {} as VaccineListType,
}

const getLoadedVaccines = (vaccinesList: VaccineListType, page: string) => {
  const loadedVacccines = vaccinesList[page]
  // do we have loaded vaccines?
  if (loadedVacccines) {
    return {
      data: loadedVacccines.data,
      meta: {
        pagination: loadedVacccines.meta.pagination,
        dataFromStore: true, // informs reducer not to save these vaccines to the store
      },
    } as VaccineListData
  }
  return null
}

/**
 * Get's the list of vaccines for the given user
 * @param screenID - screen that is waiting for vaccines to load
 */
export const getVaccines =
  (screenID?: ScreenIDTypes, page = 1): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getVaccines(screenID))))

    try {
      dispatch(dispatchStartGetVaccines())
      let vaccinesData

      const { loadedVaccines: loadedItems } = getState().vaccine
      const loadedVaccines = getLoadedVaccines(loadedItems, page.toString())

      if (loadedVaccines) {
        vaccinesData = loadedVaccines
      } else {
        vaccinesData = await api.get<VaccineListData>('/v1/health/immunizations', {
          'page[number]': page.toString(),
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
          sort: 'date',
        })
      }
      const hasRequiredFields = vaccinesData?.data.every((v) => {
        return !!v.attributes?.date && !!v.attributes?.groupName && !!v.attributes?.shortDescription
      })

      // Ensure all required fields(date, groupName, and type and dosage) exist; otherwise throw API Error
      if (!hasRequiredFields) {
        throw { status: 500, json: { errors: [] } } as APIError
      }

      dispatch(dispatchFinishGetVaccines({ page, vaccinesData }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetVaccines({ page, vaccinesData: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error, screenID), screenID }))
      }
    }
  }

/**
 * Gets the location data for a given vaccine. Does not use the standard error path because in the case of a failure
 * we still want to show the details screen with a placeholder for the location data
 * @param vaccineId - Id of the vaccine to get location data for
 * @param locationId - Id of the location to to get data for
 */
export const getVaccineLocation =
  (vaccineId: string, locationId: string): AppThunk =>
  async (dispatch) => {
    if (!locationId) {
      dispatch(dispatchFinishGetLocation({}))
      return
    }

    try {
      dispatch(dispatchStartGetLocation())

      const locationData = await api.get<VaccineLocationData>(`/v0/health/locations/${locationId}`)

      dispatch(dispatchFinishGetLocation({ vaccineId, location: locationData?.data }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetLocation({ vaccineId: undefined, location: undefined, error }))
      }
    }
  }

/**
 * Redux Action to send va vaccine details analytics
 *
 * @returns AsyncReduxAction
 */
export const sendVaccineDetailsAnalytics =
  (groupName: string): AppThunk =>
  async () => {
    await logAnalyticsEvent(Events.vama_vaccine_details(groupName))
  }

/**
 * Redux Action to log covid button click analytics
 *
 * @returns AsyncReduxAction
 */

export const logCOVIDClickAnalytics =
  (referringScreen: string): AppThunk =>
  async () => {
    await logAnalyticsEvent(Events.vama_covid_links(referringScreen))
  }

const vaccineSlice = createSlice({
  name: 'vaccines',
  initialState: initialVaccineState,
  reducers: {
    dispatchStartGetVaccines: (state) => {
      state.loading = true
    },

    dispatchStartGetLocation: (state) => {
      state.detailsLoading = true
    },

    dispatchFinishGetVaccines: (state, action: PayloadAction<{ page: number; vaccinesData?: VaccineListData; error?: APIError }>) => {
      const { page, vaccinesData, error } = action.payload
      const { data: vaccines, meta } = vaccinesData || ({} as VaccineListData)
      const vaccinesById = indexBy(vaccines || [], 'id')

      const curLoadedVaccines = state.loadedVaccines[page.toString()]
      const vaccineList = vaccines || []

      state.error = error
      state.loading = false
      state.vaccines = vaccineList
      state.vaccinesById = vaccinesById
      state.vaccinePagination = { ...meta?.pagination }
      state.loadedVaccines[page] = meta?.dataFromStore ? curLoadedVaccines : vaccinesData ? vaccinesData : ({} as VaccineListData)
    },

    dispatchFinishGetLocation: (state, action: PayloadAction<{ vaccineId?: string; location?: VaccineLocation; error?: APIError }>) => {
      const { vaccineId, location, error } = action.payload

      if (!error && vaccineId && location) {
        state.vaccineLocationsById[vaccineId] = location
      }

      state.detailsLoading = false
    },
  },
})

export const { dispatchFinishGetLocation, dispatchFinishGetVaccines, dispatchStartGetLocation, dispatchStartGetVaccines } = vaccineSlice.actions
export default vaccineSlice.reducer

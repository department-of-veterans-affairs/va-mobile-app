import { AsyncReduxAction, ReduxAction } from '../types'

import * as api from '../api'
import { APIError, ScreenIDTypes, VaccineListData, VaccineLocation, VaccineLocationData } from '../api'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Events } from 'constants/analytics'
import { VaccineListType } from 'store'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from '../../utils/common'
import { logAnalyticsEvent } from 'utils/analytics'

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
    } as api.VaccineListData
  }
  return null
}

/**
 * Action to signify the beginning of the vaccine list loading.
 */
const dispatchStartGetVaccines = (): ReduxAction => {
  return {
    type: 'VACCINE_START_GET_VACCINES',
    payload: {},
  }
}

/**
 * Action to signal the vaccines have finished loading
 * @param vaccines - list of vaccines if the api call was successful
 * @param error - error to parse if api call failed
 */
const dispatchFinishGetVaccines = (page: number, vaccinesData?: VaccineListData, error?: APIError): ReduxAction => {
  return {
    type: 'VACCINE_FINISH_GET_VACCINES',
    payload: {
      vaccinesData,
      page,
      error,
    },
  }
}

/**
 * Action to signify the beginning of the vaccine location loading.
 */
const dispatchStartGetLocation = (): ReduxAction => {
  return {
    type: 'VACCINE_START_GET_LOCATION',
    payload: {},
  }
}

/**
 * Action to complete loading of a vaccine location
 * @param vaccineId - ID of the vaccine associated with the location
 * @param location - location data to display
 * @param error - error if the call failed
 */
const dispatchFinishGetLocation = (vaccineId?: string, location?: VaccineLocation, error?: APIError): ReduxAction => {
  return {
    type: 'VACCINE_FINISH_GET_LOCATION',
    payload: {
      vaccineId,
      location,
      error,
    },
  }
}

/**
 * Get's the list of vaccines for the given user
 * @param screenID - screen that is waiting for vaccines to load
 */
export const getVaccines = (screenID?: ScreenIDTypes, page = 1): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getVaccines(screenID))))

    try {
      dispatch(dispatchStartGetVaccines())
      let vaccineData

      const { loadedVaccines: loadedItems } = getState().vaccine
      const loadedVaccines = getLoadedVaccines(loadedItems, page.toString())

      if (loadedVaccines) {
        vaccineData = loadedVaccines
      } else {
        vaccineData = await api.get<VaccineListData>('/v1/health/immunizations', {
          'page[number]': page.toString(),
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
          sort: 'date',
        })
      }
      const hasRequiredFields = vaccineData?.data.every((v) => {
        return !!v.attributes?.date && !!v.attributes?.groupName && !!v.attributes?.shortDescription
      })

      // Ensure all required fields(date, groupName, and type and dosage) exist; otherwise throw API Error
      if (!hasRequiredFields) {
        throw { status: 500, json: { errors: [] } } as APIError
      }

      dispatch(dispatchFinishGetVaccines(page, vaccineData))
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishGetVaccines(page, undefined, err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err, screenID), screenID))
      }
    }
  }
}

/**
 * Gets the location data for a given vaccine. Does not use the standard error path because in the case of a failure
 * we still want to show the details screen with a placeholder for the location data
 * @param vaccineId - Id of the vaccine to get location data for
 * @param locationId - Id of the location to to get data for
 */
export const getVaccineLocation = (vaccineId: string, locationId: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    if (!locationId) {
      dispatch(dispatchFinishGetLocation())
      return
    }

    try {
      dispatch(dispatchStartGetLocation())

      const locationData = await api.get<VaccineLocationData>(`/v0/health/locations/${locationId}`)

      dispatch(dispatchFinishGetLocation(vaccineId, locationData?.data))
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishGetLocation(undefined, undefined, err))
      }
    }
  }
}

/**
 * Redux Action to send va vaccine details analytics
 *
 * @returns AsyncReduxAction
 */
export const sendVaccineDetailsAnalytics = (groupName: string): AsyncReduxAction => {
  return async (): Promise<void> => {
    await logAnalyticsEvent(Events.vama_vaccine_details(groupName))
  }
}

/**
 * Redux Action to log covid button click analytics
 *
 * @returns AsyncReduxAction
 */
export const logCOVIDClickAnalytics = (referringScreen: string): AsyncReduxAction => {
  return async (): Promise<void> => {
    await logAnalyticsEvent(Events.vama_covid_links(referringScreen))
  }
}

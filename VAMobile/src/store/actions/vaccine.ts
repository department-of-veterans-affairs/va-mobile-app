import { AsyncReduxAction, ReduxAction } from '../types'

import * as api from '../api'
import { APIError, ScreenIDTypes, VaccineList, VaccineListData, VaccineLocation, VaccineLocationData } from '../api'
import { Events } from 'constants/analytics'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from '../../utils/common'
import { logAnalyticsEvent } from 'utils/analytics'

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
const dispatchFinishGetVaccines = (vaccines?: VaccineList, error?: APIError): ReduxAction => {
  return {
    type: 'VACCINE_FINISH_GET_VACCINES',
    payload: {
      vaccines,
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
export const getVaccines = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getVaccines(screenID))))

    try {
      dispatch(dispatchStartGetVaccines())

      const vaccineData = await api.get<VaccineListData>('/v0/health/immunizations')

      const hasRequiredFields = vaccineData?.data.every((v) => {
        return !!v.attributes?.date && !!v.attributes?.groupName && !!v.attributes?.shortDescription
      })

      // Ensure all required fields(date, groupName, and type and dosage) exist; otherwise throw API Error
      if (!hasRequiredFields) {
        throw { status: 500, json: { errors: [] } } as APIError
      }

      dispatch(dispatchFinishGetVaccines(vaccineData?.data))
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishGetVaccines(undefined, err))
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

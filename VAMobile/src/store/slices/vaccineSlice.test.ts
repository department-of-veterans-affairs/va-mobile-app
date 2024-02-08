import { find } from 'underscore'

import { context, realStore } from 'testUtils'

import * as api from '../api'
import { getVaccineLocation, getVaccines } from './vaccineSlice'

export const ActionTypes: {
  VACCINE_START_GET_VACCINES: string
  VACCINE_FINISH_GET_VACCINES: string
  VACCINE_START_GET_LOCATION: string
  VACCINE_FINISH_GET_LOCATION: string
  ERRORS_SET_ERROR: string
} = {
  VACCINE_START_GET_VACCINES: 'vaccines/dispatchStartGetVaccines',
  VACCINE_FINISH_GET_VACCINES: 'vaccines/dispatchFinishGetVaccines',
  ERRORS_SET_ERROR: 'error/dispatchSetError',
  VACCINE_START_GET_LOCATION: 'vaccines/dispatchStartGetLocation',
  VACCINE_FINISH_GET_LOCATION: 'vaccines/dispatchFinishGetLocation',
}

context('vaccine', () => {
  describe('getVaccines', () => {
    it('should get the users vaccine list', async () => {
      const store = realStore()
      await store.dispatch(getVaccines())
      const actions = store.getActions()

      const startAction = find(actions, { type: ActionTypes.VACCINE_START_GET_VACCINES })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.vaccine.loading).toBeTruthy()

      expect(api.get as jest.Mock).toBeCalledWith('/v1/health/immunizations', {
        'page[number]': '1',
        'page[size]': '10',
        sort: 'date',
      })

      const finishAction = find(actions, { type: ActionTypes.VACCINE_FINISH_GET_VACCINES })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.vaccine.loading).toBeFalsy()
    })
  })

  describe('getVaccineLocation', () => {
    it('should get location data for an ID', async () => {
      const store = realStore()
      await store.dispatch(getVaccineLocation('vax1', 'location1'))
      const actions = store.getActions()

      const startAction = find(actions, { type: ActionTypes.VACCINE_START_GET_LOCATION })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.vaccine.detailsLoading).toBeTruthy()

      expect(api.get as jest.Mock).toBeCalledWith('/v0/health/locations/location1')

      const finishAction = find(actions, { type: ActionTypes.VACCINE_FINISH_GET_LOCATION })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.vaccine.detailsLoading).toBeFalsy()
    })
  })
})

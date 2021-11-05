import { find } from 'underscore'

import { context, realStore } from 'testUtils'
import {getVaccineLocation, getVaccines} from './vaccine'
import * as api from '../api'
import { when } from 'jest-when'
import { CommonErrorTypesConstants } from '../../constants/errors'
import { ScreenIDTypesConstants } from '../api/types/Screens'

context('vaccine', () => {
  describe('getVaccines', () => {
    it('should get the users vaccine list', async () => {
      const store = realStore()
      await store.dispatch(getVaccines())
      const actions = store.getActions()

      const startAction = find(actions, { type: 'VACCINE_START_GET_VACCINES' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.vaccine.loading).toBeTruthy()

      expect(api.get as jest.Mock).toBeCalledWith('/v0/health/immunizations')

      const finishAction = find(actions, { type: 'VACCINE_FINISH_GET_VACCINES' })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.vaccine.loading).toBeFalsy()
    })
  })

  describe('partial data on core fields', () => {
    it('should set error for vaccine list', async () => {
      when(api.get as jest.Mock).calledWith('/v0/health/immunizations').mockResolvedValue({
        data: [
          {
            "id": "I2-A7XD2XUPAZQ5H4Y5D6HJ352GEQ000000",
            "type": "immunization",
            "attributes": {
              "cvxCode": 140,
              "date": "2009-03-19T12:24:55Z",
              "doseNumber": "Booster",
              "doseSeries": 1,
              "groupName": "FLU",
              "manufacturer": null,
              "note": "Dose #45 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.",
              "shortDescription": "Influenza  seasonal  injectable  preservative free"
            }
          },
          {
            "id": "I2-6SIQZNJCIOAQOGES6YOTSQAWJY000000",
            "type": "immunization",
            "attributes": {
              "cvxCode": 140,
              "date": "",
              "doseNumber": null,
              "doseSeries": null,
              "groupName": "",
              "manufacturer": null,
              "note": "Dose #46 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.",
              "shortDescription": ""
            }
          },
        ]
      })

      const store = realStore()
      await store.dispatch(getVaccines(ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID))
      const actions = store.getActions()

      const startAction = find(actions, { type: 'VACCINE_START_GET_VACCINES' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.vaccine.loading).toBeTruthy()

      expect(api.get as jest.Mock).toBeCalledWith('/v0/health/immunizations')

      const finishAction = find(actions, { type: 'VACCINE_FINISH_GET_VACCINES' })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.vaccine.loading).toBeFalsy()

      const errorAction = find(actions, { type: 'ERRORS_SET_ERROR' })
      expect(errorAction).toBeTruthy()

      const { errors } = store.getState()
      expect(errors.errorsByScreenID.VACCINE_LIST_SCREEN_ID).toEqual(CommonErrorTypesConstants.APP_LEVEL_ERROR_VACCINE)
    })
  })

  describe('getVaccineLocation', () => {
    it('should get location data for an ID', async () => {
      const store = realStore()
      await store.dispatch(getVaccineLocation('vax1', 'location1'))
      const actions = store.getActions()

      const startAction = find(actions, { type: 'VACCINE_START_GET_LOCATION' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.vaccine.detailsLoading).toBeTruthy()

      expect(api.get as jest.Mock).toBeCalledWith('/v0/health/locations/location1')

      const finishAction = find(actions, { type: 'VACCINE_FINISH_GET_LOCATION' })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.vaccine.detailsLoading).toBeFalsy()
    })
  })
})

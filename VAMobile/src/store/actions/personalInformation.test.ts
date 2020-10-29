import _ from 'underscore'

import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import { editUsersNumber } from './personalInformation'

context('personalInformation', () => {
  describe('editUsersNumber', () => {
    it('should edit the users phone number', async () => {
      const updatedPhoneData = {
        id: 0,
        areaCode: '000',
        countryCode: '1',
        phoneNumber: '1234567',
        phoneType: 'HOME',
      }

      when(api.put as jest.Mock).calledWith('/v0/user/phones', updatedPhoneData).mockResolvedValue({ })

      const store = realStore()
      await store.dispatch(editUsersNumber('HOME', '0001234567', '1111', 0, true))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })

    it('should get error if it cannot get data', async () => {
      const error = new Error('error from backend')

      const updatedPhoneData = {
        id: 0,
        areaCode: '000',
        countryCode: '1',
        phoneNumber: '1234567',
        phoneType: 'HOME',
      }

      when(api.put as jest.Mock).calledWith('/v0/user/phones', updatedPhoneData).mockResolvedValue(Promise.reject(error))

      const store = realStore()
      await store.dispatch(editUsersNumber('HOME', '0001234567', '1111', 0, true))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.error).toBeTruthy()

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toEqual(error)
    })
  })
})

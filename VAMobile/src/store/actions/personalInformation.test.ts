import _ from 'underscore'

import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import {editUsersNumber, updateEmail, getProfileInfo} from './personalInformation'

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

  describe('getProfileInfo', () => {
    it ('should get the users profile info', async () => {
      const mockProfilePayload = {
        data: {
          attributes: {
            profile: {
              fax_phone: {
                id: 1,
                areaCode: '555',
                countryCode: '1',
                phoneNumber: '1234567',
                phoneType: 'FAX',
              },
              formatted_fax_phone: '(555)-123-4567',
              formatted_home_phone: '(555)-123-4568',
              formatted_mobile_phone: '(555)-123-4569',
              formatted_work_phone: '(555)-123-4560',
              home_phone: {
                id: 1,
                areaCode: '555',
                countryCode: '1',
                phoneNumber: '1234568',
                phoneType: 'HOME',
              },
              mailing_address: undefined,
              mobile_phone: {
                id: 1,
                areaCode: '555',
                countryCode: '1',
                phoneNumber: '1234569',
                phoneType: 'MOBILE',
              },
              most_recent_branch: 'United States Air Force',
              residential_address: undefined,
              work_phone: {
                id: 1,
                areaCode: '555',
                countryCode: '1',
                phoneNumber: '1234560',
                phoneType: 'WORK',
              },
              first_name: 'Test',
              middle_name: '',
              last_name: 'LastN',
              full_name: 'Test LastN',
              email: 'user123@id.me',
              birth_date: '04/01/1970',
              gender: 'M',
              addresses: '1234 Test Ln',
            }
          }
        }
      }

      when(api.get as jest.Mock)
      .calledWith('/v0/user')
      .mockResolvedValue(mockProfilePayload)

      const store = realStore()
      await store.dispatch(getProfileInfo())
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_GET_INFO' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_GET_INFO' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      const { personalInformation } = store.getState()
      expect(personalInformation.profile).toEqual(mockProfilePayload.data.attributes.profile)
      expect(personalInformation.error).toBeFalsy()
    })
  })

  describe('edit email', () => {
    it('should edit the users email', async () => {
      const store = realStore()
      await store.dispatch(updateEmail('newEmail@email.com'))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_EMAIL' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_EMAIL' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.personalInformation.emailSaved).toBe(true)

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })
  })
})

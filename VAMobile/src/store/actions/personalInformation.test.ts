import _ from 'underscore'

import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import {editUsersNumber, updateEmail, getProfileInfo, updateAddress, finishEditAddress} from './personalInformation'
import {AddressData} from '../api'

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
      await store.dispatch(editUsersNumber('HOME', '0001234567', '1111', 0))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER' })
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
      await store.dispatch(editUsersNumber('HOME', '0001234567', '1111', 0))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER' })
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
              formattedFaxPhone: '(555)-123-4567',
              formattedHomePhone: '(555)-123-4568',
              formattedMobilePhone: '(555)-123-4569',
              formattedWorkPhone: '(555)-123-4560',
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
              contactEmail: { emailAddress: 'user123@id.me', id: '0' },
              signinEmail: 'user123@id.me',
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

  describe('updateAddress', () => {
    it('should edit the users address', async () => {
      const store = realStore()
      await store.dispatch(updateAddress({} as AddressData))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_ADDRESS' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.addressUpdated).toBeTruthy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })
  })
  describe('finishEditAddress', () => {
    it('should update addressUpdated', async () => {
      const store = realStore()
      await store.dispatch(finishEditAddress())
      const actions = store.getActions()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_EDIT_ADDRESS' })
      expect(endAction?.state.personalInformation.addressUpdated).toBeFalsy()
    })
  })
})

import _ from 'underscore'

import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import { getProfileInfo } from './personalInformationSlice'

export const ActionTypes: {
  PERSONAL_INFORMATION_START_GET_INFO: string
  PERSONAL_INFORMATION_FINISH_GET_INFO: string
  AUTHORIZED_SERVICES_UPDATE: string
  CERNER_UPDATE: string
} = {
  PERSONAL_INFORMATION_START_GET_INFO: 'personalInformation/dispatchStartGetProfileInfo',
  PERSONAL_INFORMATION_FINISH_GET_INFO: 'personalInformation/dispatchFinishGetProfileInfo',
  AUTHORIZED_SERVICES_UPDATE: 'authorizedServices/dispatchUpdateAuthorizedServices',
  CERNER_UPDATE: 'patient/dispatchUpdateCerner',
}

context('personalInformation', () => {

  describe('getProfileInfo', () => {
    it('should get the users profile info', async () => {
      const mockProfilePayload = {
        data: {
          attributes: {
            profile: {
              formattedHomePhone: '(555)-123-4568',
              formattedMobilePhone: '(555)-123-4569',
              formattedWorkPhone: '(555)-123-4560',
              homePhoneNumber: {
                id: 1,
                areaCode: '555',
                countryCode: '1',
                phoneNumber: '1234568',
                phoneType: 'HOME',
              },
              mailingAddress: undefined,
              mobilePhoneNumber: {
                id: 1,
                areaCode: '555',
                countryCode: '1',
                phoneNumber: '1234569',
                phoneType: 'MOBILE',
              },
              residentialAddress: undefined,
              workPhoneNumber: {
                id: 1,
                areaCode: '555',
                countryCode: '1',
                phoneNumber: '1234560',
                phoneType: 'WORK',
              },
              firstName: 'Test',
              middleName: 'NOT_FOUND',
              lastName: 'ing',
              genderIdentity: null,
              contactEmail: { emailAddress: 'user123@id.me', id: '0' },
              signinEmail: 'user123@id.me',
              birthDate: '04/01/1970',
              addresses: '1234 Test Ln',
            },
          },
        },
      }

      when(api.get as jest.Mock)
        .calledWith('/v1/user')
        .mockResolvedValue(mockProfilePayload)

      const store = realStore()
      await store.dispatch(getProfileInfo())
      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.PERSONAL_INFORMATION_START_GET_INFO })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.PERSONAL_INFORMATION_FINISH_GET_INFO })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      const { personalInformation } = store.getState()
      expect(personalInformation.profile).toEqual({
        ...mockProfilePayload.data.attributes.profile,
        firstName: 'Test',
        middleName: '',
        lastName: 'ing',
        fullName: 'Test ing',
      })
      expect(personalInformation.error).toBeFalsy()
    })

    it('should get authorizedServices information', async () => {
      const mockAuthorizedServicesPayload = {
        data: {
          attributes: {
            profile: {},
            authorizedServices: ['directDepositBenefits'],
          },
        },
      }

      when(api.get as jest.Mock)
        .calledWith('/v1/user')
        .mockResolvedValue(mockAuthorizedServicesPayload)

      const store = realStore()
      await store.dispatch(getProfileInfo())
      const actions = store.getActions()

      const updateAction = _.find(actions, { type: ActionTypes.AUTHORIZED_SERVICES_UPDATE })
      expect(updateAction).toBeTruthy()

      const { authorizedServices } = store.getState()
      expect(authorizedServices.directDepositBenefits).toBeTruthy()
      expect(authorizedServices.error).toBeFalsy()
    })

    it('should get health information', async () => {
      const mockFacilities = [
        {
          facilityId: '1',
          isCerner: true,
          facilityName: 'Test Veterans Outpatient Clinic',
        },
        {
          facilityId: '2',
          isCerner: false,
          facilityName: '',
        },
      ]
      const mockHealthPayload = {
        data: {
          attributes: {
            profile: {},
            authorizedServices: [],
            health: {
              facilities: mockFacilities,
              isCernerPatient: true,
            },
          },
        },
      }

      when(api.get as jest.Mock)
        .calledWith('/v1/user')
        .mockResolvedValue(mockHealthPayload)

      const store = realStore()
      await store.dispatch(getProfileInfo())
      const actions = store.getActions()

      const updateAction = _.find(actions, { type: ActionTypes.CERNER_UPDATE })
      expect(updateAction).toBeTruthy()

      const { error, cernerFacilities, isCernerPatient, facilities } = store.getState().patient
      expect(isCernerPatient).toBeTruthy()
      expect(cernerFacilities).toEqual([mockFacilities[0]])
      expect(facilities).toEqual(mockFacilities)
      expect(error).toBeFalsy()
    })

    it('should get errors if userProfileData is not received', async () => {
      const error = new Error('error from backend')

      when(api.get as jest.Mock)
        .calledWith('/v1/user')
        .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getProfileInfo())
      const actions = store.getActions()

      const startPersonalInfoAction = _.find(actions, { type: ActionTypes.PERSONAL_INFORMATION_START_GET_INFO })
      expect(startPersonalInfoAction).toBeTruthy()
      expect(startPersonalInfoAction?.state.personalInformation.loading).toBeTruthy()

      const endPersonalInfoAction = _.find(actions, { type: ActionTypes.PERSONAL_INFORMATION_FINISH_GET_INFO })
      expect(endPersonalInfoAction?.state.personalInformation.loading).toBeFalsy()

      const { personalInformation } = store.getState()
      expect(personalInformation.profile).toBeFalsy()
      expect(personalInformation.error).toBeTruthy()

      const updateAuthorizedServicesAction = _.find(actions, { type: ActionTypes.AUTHORIZED_SERVICES_UPDATE })
      expect(updateAuthorizedServicesAction).toBeTruthy()

      const { authorizedServices } = store.getState()
      expect(authorizedServices.directDepositBenefits).toBeFalsy()
      expect(authorizedServices.error).toBeTruthy()
    })
  })
})

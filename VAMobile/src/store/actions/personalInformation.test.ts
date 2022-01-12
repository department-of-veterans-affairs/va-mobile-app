import _ from 'underscore'

import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import {
  editUsersNumber,
  updateEmail,
  getProfileInfo,
  updateAddress,
  finishEditAddress,
  validateAddress,
  deleteUsersNumber,
  deleteAddress,
  deleteEmail,
} from './personalInformation'
import { AddressData, AddressValidationScenarioTypesConstants } from 'store/api/types'
import { StoreState } from '../reducers'

context('personalInformation', () => {
  const mockStorePersonalInformation: Partial<StoreState> = {
    personalInformation: {
      loading: false,
      savingAddress: false,
      profile: {
        firstName: 'Ben',
        middleName: 'J',
        lastName: 'Morgan',
        fullName: 'Ben J Morgan',
        contactEmail: { emailAddress: 'ben@gmail.com', id: '0' },
        signinEmail: 'ben@gmail.com',
        birthDate: '1990-05-08',
        gender: 'M',
        addresses: '',
        residentialAddress: {
          id: 1,
          addressLine1: '10 Laurel Way',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'DOMESTIC',
          city: 'Novato',
          countryCodeIso3: '1',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        },
        mailingAddress: {
          id: 2,
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'DOMESTIC',
          city: 'Tiburon',
          countryCodeIso3: '1',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        },
        homePhoneNumber: {
          id: 1,
          areaCode: '858',
          countryCode: '1',
          phoneNumber: '6901289',
          phoneType: 'HOME',
        },
        formattedHomePhone: '(858)-690-1289',
        mobilePhoneNumber: {
          id: 1,
          areaCode: '858',
          countryCode: '1',
          phoneNumber: '6901288',
          phoneType: 'HOME',
        },
        formattedMobilePhone: '(858)-690-1288',
        workPhoneNumber: {
          id: 1,
          areaCode: '858',
          countryCode: '1',
          phoneNumber: '6901287',
          phoneType: 'HOME',
        },
        formattedWorkPhone: '(858)-690-1287',
        faxNumber: {
          id: 1,
          areaCode: '858',
          countryCode: '1',
          phoneNumber: '6901286',
          phoneType: 'HOME',
        },
        formattedFaxPhone: '(858)-690-1286',
        signinService: 'IDME',
      },
      needsDataLoad: false,
      emailSaved: false,
      addressSaved: false,
      showValidation: false,
      preloadComplete: false,
      phoneNumberSaved: false,
    },
  }

  describe('deleteUsersNumber', () => {
    it('should delete the users phone number', async () => {
      const phoneData = {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901289',
        phoneType: 'HOME',
      }

      when(api.del as jest.Mock)
        .calledWith('/v0/user/phones', phoneData)
        .mockResolvedValue({})

      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(deleteUsersNumber('HOME'))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      expect(api.del as jest.Mock).toBeCalledWith('/v0/user/phones', phoneData)

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })
  })

  describe('editUsersNumber', () => {
    it('should edit the users phone number', async () => {
      const updatedPhoneData = {
        id: 0,
        areaCode: '000',
        countryCode: '1',
        phoneNumber: '1234567',
        phoneType: 'HOME',
      }

      when(api.put as jest.Mock)
        .calledWith('/v0/user/phones', updatedPhoneData)
        .mockResolvedValue({})

      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(editUsersNumber('HOME', '0001234567', '1111', 0))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      expect(api.put as jest.Mock).toBeCalledWith('/v0/user/phones', { areaCode: '000', countryCode: '1', id: 0, phoneNumber: '1234567', phoneType: 'HOME', extension: '1111' })

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })

    it('should call api.post for a new entry', async () => {
      const updatedPhoneData = {
        areaCode: '000',
        countryCode: '1',
        phoneNumber: '1234567',
        phoneType: 'HOME',
      }

      when(api.post as jest.Mock)
        .calledWith('/v0/user/phones', updatedPhoneData)
        .mockResolvedValue({})

      const store = realStore()
      await store.dispatch(editUsersNumber('HOME', '0001234567', '1111', 0))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      expect(api.post as jest.Mock).toBeCalledWith('/v0/user/phones', { areaCode: '000', countryCode: '1', phoneNumber: '1234567', phoneType: 'HOME', extension: '1111' })

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })

    it('should get error if editUsersNumber fails', async () => {
      const error = new Error('error from backend')

      const updatedPhoneData = {
        id: 0,
        areaCode: '000',
        countryCode: '1',
        phoneNumber: '1234567',
        phoneType: 'HOME',
        extension: '1111',
      }

      when(api.put as jest.Mock)
        .calledWith('/v0/user/phones', updatedPhoneData)
        .mockResolvedValue(Promise.reject(error))

      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(editUsersNumber('HOME', '0001234567', '1111', 0))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.error).toBeTruthy()

      expect(api.put as jest.Mock).toBeCalledWith('/v0/user/phones', { areaCode: '000', countryCode: '1', id: 0, phoneNumber: '1234567', phoneType: 'HOME', extension: '1111' })

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toEqual(error)
    })
  })

  describe('getProfileInfo', () => {
    it('should get the users profile info', async () => {
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
              contactEmail: { emailAddress: 'user123@id.me', id: '0' },
              signinEmail: 'user123@id.me',
              birthDate: '04/01/1970',
              gender: 'M',
              addresses: '1234 Test Ln',
            },
          },
        },
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
        .calledWith('/v0/user')
        .mockResolvedValue(mockAuthorizedServicesPayload)

      const store = realStore()
      await store.dispatch(getProfileInfo())
      const actions = store.getActions()

      const updateAction = _.find(actions, { type: 'AUTHORIZED_SERVICES_UPDATE' })
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
        .calledWith('/v0/user')
        .mockResolvedValue(mockHealthPayload)

      const store = realStore()
      await store.dispatch(getProfileInfo())
      const actions = store.getActions()

      const updateAction = _.find(actions, { type: 'CERNER_UPDATE' })
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
        .calledWith('/v0/user')
        .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getProfileInfo())
      const actions = store.getActions()

      const startPersonalInfoAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_GET_INFO' })
      expect(startPersonalInfoAction).toBeTruthy()
      expect(startPersonalInfoAction?.state.personalInformation.loading).toBeTruthy()

      const endPersonalInfoAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_GET_INFO' })
      expect(endPersonalInfoAction?.state.personalInformation.loading).toBeFalsy()

      const { personalInformation } = store.getState()
      expect(personalInformation.profile).toBeFalsy()
      expect(personalInformation.error).toBeTruthy()

      const updateAuthorizedServicesAction = _.find(actions, { type: 'AUTHORIZED_SERVICES_UPDATE' })
      expect(updateAuthorizedServicesAction).toBeTruthy()

      const { authorizedServices } = store.getState()
      expect(authorizedServices.directDepositBenefits).toBeFalsy()
      expect(authorizedServices.error).toBeTruthy()
    })
  })

  describe('edit email', () => {
    it('should edit the users email', async () => {
      when(api.put as jest.Mock)
        .calledWith('/v0/user/emails')
        .mockResolvedValue({})
      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(updateEmail('newEmail@email.com', '111'))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_EMAIL' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_EMAIL' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.personalInformation.emailSaved).toBe(true)

      expect(api.put as jest.Mock).toBeCalledWith('/v0/user/emails', { emailAddress: 'newEmail@email.com', id: '111' })

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })

    it('should call api.post for a new entry', async () => {
      when(api.post as jest.Mock)
        .calledWith('/v0/user/emails')
        .mockResolvedValue({})

      const store = realStore()
      await store.dispatch(updateEmail('newEmail@email.com', ''))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_EMAIL' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_EMAIL' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.personalInformation.emailSaved).toBe(true)

      expect(api.post as jest.Mock).toBeCalledWith('/v0/user/emails', { emailAddress: 'newEmail@email.com' })

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })

    it('should get error if updateEmail fails', async () => {
      const error = new Error('error from backend')

      when(api.put as jest.Mock)
        .calledWith('/v0/user/emails', { emailAddress: 'test@email.com', id: '1' })
        .mockRejectedValue(error)

      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(updateEmail('test@email.com', '1'))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_EMAIL' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_EMAIL' })
      expect(endAction).toBeTruthy()

      expect(api.put as jest.Mock).toBeCalledWith('/v0/user/emails', { emailAddress: 'test@email.com', id: '1' })

      const { personalInformation } = store.getState()
      expect(personalInformation.emailSaved).toBe(false)
      expect(personalInformation.error).toBe(error)
    })
  })

  describe('delete email', () => {
    it('should delete the users email', async () => {
      when(api.del as jest.Mock)
        .calledWith('/v0/user/emails')
        .mockResolvedValue({})
      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(deleteEmail('newEmail@email.com', '111'))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_EMAIL' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_EMAIL' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.personalInformation.emailSaved).toBe(true)

      expect(api.del as jest.Mock).toBeCalledWith('/v0/user/emails', { emailAddress: 'newEmail@email.com', id: '111' })

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })
  })

  describe('updateAddress', () => {
    it('should edit the users address', async () => {
      const addressPayload: AddressData = {
        id: 12314,
        addressLine1: 'addressLine1',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'City',
        countryName: 'countryCode',
        countryCodeIso3: 'countryCodeIso3',
        stateCode: 'stateCode',
        zipCode: '85431',
      }

      when(api.put as jest.Mock)
        .calledWith('/v0/user/addresses', addressPayload)
        .mockResolvedValue({})

      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(updateAddress(addressPayload as AddressData))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_ADDRESS' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.addressSaved).toBeTruthy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      expect(api.put as jest.Mock).toBeCalledWith('/v0/user/addresses', addressPayload)

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })

    it('should call api.post for a new entry', async () => {
      const addressPayload = {
        addressLine1: 'Post addressLine1',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'Post City',
        countryName: 'Post countryCode',
        countryCodeIso3: 'Post countryCodeIso3',
        stateCode: 'Post stateCode',
        zipCode: '85431',
      }

      when(api.post as jest.Mock)
        .calledWith('/v0/user/addresses', addressPayload)
        .mockResolvedValue(mockStorePersonalInformation)

      const store = realStore()
      await store.dispatch(updateAddress(addressPayload as AddressData))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_ADDRESS' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.addressSaved).toBeTruthy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      expect(api.post as jest.Mock).toBeCalledWith('/v0/user/addresses', addressPayload)

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })

    it('should get error if updateAddress fails', async () => {
      const error = new Error('error from backend')

      const addressPayload: AddressData = {
        id: 12314,
        addressLine1: 'addressLine1',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'City',
        countryName: 'countryCode',
        countryCodeIso3: 'countryCodeIso3',
        stateCode: 'stateCode',
        zipCode: '85431',
      }

      when(api.put as jest.Mock)
        .calledWith('/v0/user/addresses', addressPayload)
        .mockRejectedValue(error)

      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(updateAddress(addressPayload as AddressData))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_ADDRESS' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.personalInformation.loading).toBeFalsy()

      expect(api.put as jest.Mock).toBeCalledWith('/v0/user/addresses', addressPayload)

      const { personalInformation } = store.getState()
      expect(personalInformation.addressSaved).toBe(false)
      expect(personalInformation.error).toBe(error)
    })
  })

  describe('deleteAddress', () => {
    it('should delete the users address', async () => {
      const addressPayload: AddressData = {
        id: 12314,
        addressLine1: 'addressLine1',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'City',
        countryName: 'countryCode',
        countryCodeIso3: 'countryCodeIso3',
        stateCode: 'stateCode',
        zipCode: '85431',
      }

      when(api.del as jest.Mock)
        .calledWith('/v0/user/addresses', addressPayload)
        .mockResolvedValue({})

      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(deleteAddress(addressPayload as AddressData))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_ADDRESS' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.personalInformation.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS' })
      expect(endAction?.state.personalInformation.loading).toBeFalsy()
      expect(endAction?.state.personalInformation.addressSaved).toBeTruthy()
      expect(endAction?.state.personalInformation.error).toBeFalsy()

      expect(api.del as jest.Mock).toBeCalledWith('/v0/user/addresses', addressPayload)

      const { personalInformation } = store.getState()
      expect(personalInformation.error).toBeFalsy()
    })
  })

  describe('validateAddress', () => {
    it('should store addressValidationData upon getting suggested address matches', async () => {
      const addressPayload = {
        addressLine1: '1015 Florida St',
        addressPou: 'CORRESPONDENCE',
        addressType: 'DOMESTIC',
        city: 'Washington',
        countryName: 'United States',
        countryCodeIso3: 'USA',
        stateCode: 'DC',
        type: 'DOMESTIC',
        zipCode: '20002',
        zipCodeSuffix: '1922',
      }

      const mockSuggestedAddress = {
        id: '0b189aba-70ce-4a4c-905b-bcfcdce0a2cd',
        type: 'suggested_address',
        attributes: {
          addressLine1: '1015 Florida Ave NE',
          addressLine2: null,
          addressLine3: null,
          addressPou: 'CORRESPONDENCE',
          addressType: 'DOMESTIC',
          city: 'Washington',
          countryCodeIso3: 'USA',
          internationalPostalCode: null,
          province: null,
          stateCode: 'DC',
          zipCode: '20002',
          zipCodeSuffix: '3705',
        },
        meta: {
          address: {
            confidenceScore: 88.0,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
          validationKey: -1889487115,
        },
      }

      const mockAddressValidationData = {
        data: [mockSuggestedAddress],
      }

      when(api.post as jest.Mock)
        .calledWith('/v0/user/addresses', addressPayload)
        .mockResolvedValue(mockStorePersonalInformation)

      when(api.post as jest.Mock)
        .calledWith('/v0/user/addresses/validate', addressPayload)
        .mockResolvedValue(mockAddressValidationData)

      const store = realStore()

      await store.dispatch(validateAddress(addressPayload as AddressData))
      expect(api.post as jest.Mock).toBeCalledWith('/v0/user/addresses/validate', addressPayload)

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_VALIDATE_ADDRESS' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_VALIDATE_ADDRESS' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.personalInformation.suggestedAddresses).toEqual([mockSuggestedAddress])
      expect(endAction?.state.personalInformation.addressData).toEqual(addressPayload)
      expect(endAction?.state.personalInformation.addressValidationScenario).toEqual(AddressValidationScenarioTypesConstants.SHOW_SUGGESTIONS_OVERRIDE)
    })

    it('should store BAD_UNIT_NUMBER_OVERRIDE as the address validation scenario', async () => {
      const addressPayload = {
        addressLine1: '301 Mission St Unit 1100-B',
        addressPou: 'CORRESPONDENCE',
        addressType: 'DOMESTIC',
        city: 'San Francisco',
        countryName: 'United States',
        countryCodeIso3: 'USA',
        stateCode: 'CA',
        type: 'DOMESTIC',
        zipCode: '94105',
      }

      const mockSuggestedAddress = {
        id: 'c0b7c2e0-39ab-440a-bc98-8272f29cef07',
        type: 'suggested_address',
        attributes: {
          addressLine1: '301 Mission St Unit 1100-B',
          addressLine2: null,
          addressLine3: null,
          addressPou: 'CORRESPONDENCE',
          addressType: 'DOMESTIC',
          city: 'San Francisco',
          countryCodeIso3: 'USA',
          internationalPostalCode: null,
          province: null,
          stateCode: 'CA',
          zipCode: '94105',
          zipCodeSuffix: '2243',
        },
        meta: {
          address: {
            confidenceScore: 95.0,
            addressType: 'Domestic',
            deliveryPointValidation: 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
          validationKey: -2111840200,
        },
      }

      const mockAddressValidationData = {
        data: [mockSuggestedAddress],
      }

      when(api.post as jest.Mock)
        .calledWith('/v0/user/addresses', addressPayload)
        .mockResolvedValue(mockStorePersonalInformation)

      when(api.post as jest.Mock)
        .calledWith('/v0/user/addresses/validate', addressPayload)
        .mockResolvedValue(mockAddressValidationData)

      const store = realStore()
      await store.dispatch(validateAddress(addressPayload as AddressData))
      const actions = store.getActions()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_VALIDATE_ADDRESS' })
      expect(endAction?.state.personalInformation.addressValidationScenario).toEqual(AddressValidationScenarioTypesConstants.BAD_UNIT_NUMBER_OVERRIDE)
    })

    it('should store MISSING_UNIT_NUMBER_OVERRIDE as the address validation scenario', async () => {
      const addressPayload = {
        addressLine1: '301 Mission St',
        addressPou: 'CORRESPONDENCE',
        addressType: 'DOMESTIC',
        city: 'San Francisco',
        countryName: 'United States',
        countryCodeIso3: 'USA',
        stateCode: 'CA',
        type: 'DOMESTIC',
        zipCode: '94105',
      }

      const mockSuggestedAddress = {
        id: 'c0b7c2e0-39ab-440a-bc98-8272f29cef07',
        type: 'suggested_address',
        attributes: {
          addressLine1: '301 Mission St',
          addressLine2: null,
          addressLine3: null,
          addressPou: 'CORRESPONDENCE',
          addressType: 'DOMESTIC',
          city: 'San Francisco',
          countryCodeIso3: 'USA',
          internationalPostalCode: null,
          province: null,
          stateCode: 'CA',
          zipCode: '94105',
          zipCodeSuffix: '2243',
        },
        meta: {
          address: {
            confidenceScore: 95.0,
            addressType: 'Domestic',
            deliveryPointValidation: 'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
          validationKey: -2111840200,
        },
      }

      const mockAddressValidationData = {
        data: [mockSuggestedAddress],
      }

      when(api.post as jest.Mock)
        .calledWith('/v0/user/addresses', addressPayload)
        .mockResolvedValue(mockStorePersonalInformation)

      when(api.post as jest.Mock)
        .calledWith('/v0/user/addresses/validate', addressPayload)
        .mockResolvedValue(mockAddressValidationData)

      const store = realStore()
      await store.dispatch(validateAddress(addressPayload as AddressData))
      const actions = store.getActions()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_VALIDATE_ADDRESS' })
      expect(endAction?.state.personalInformation.addressValidationScenario).toEqual(AddressValidationScenarioTypesConstants.MISSING_UNIT_OVERRIDE)
    })

    it('should update address when it is a successful validation', async () => {
      const addressPayload = {
        addressLine1: '2246 San Miguel Ave.',
        addressPou: 'CORRESPONDENCE',
        addressType: 'DOMESTIC',
        city: 'Santa Rosa',
        countryName: 'United States',
        countryCodeIso3: 'USA',
        stateCode: 'CA',
        type: 'DOMESTIC',
        zipCode: '95403',
        zipCodeSuffix: '1922',
      }

      const mockSuggestedAddress = {
        id: '2f4031e2-9903-4083-8355-35bf1ac6322b',
        type: 'suggested_address',
        attributes: {
          addressLine1: '2248 San Miguel Ave',
          addressLine2: null,
          addressLine3: null,
          addressPou: 'CORRESPONDENCE',
          addressType: 'DOMESTIC',
          city: 'Washington',
          countryCodeIso3: 'USA',
          internationalPostalCode: null,
          province: null,
          stateCode: 'CA',
          zipCode: '95403',
          zipCodeSuffix: '1875',
        },
        meta: {
          address: {
            confidenceScore: 100.0,
            addressType: 'Domestic',
            deliveryPointValidation: 'CONFIRMED',
            residentialDeliveryIndicator: 'RESIDENTIAL',
          },
          validationKey: 1261063725,
        },
      }

      const mockAddressValidationData = {
        data: [mockSuggestedAddress],
      }

      when(api.post as jest.Mock)
        .calledWith('/v0/user/addresses/validate', addressPayload)
        .mockResolvedValue(mockAddressValidationData)

      const store = realStore()

      await store.dispatch(validateAddress(addressPayload as AddressData))
      expect(api.post as jest.Mock).toBeCalledWith('/v0/user/addresses/validate', addressPayload)

      const actions = store.getActions()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_VALIDATE_ADDRESS' })
      expect(endAction?.state.personalInformation.suggestedAddresses).toBeUndefined()
      expect(endAction?.state.personalInformation.addressData).toBeUndefined()
      expect(endAction?.state.personalInformation.addressValidationScenario).toBeUndefined()

      const updateAddressStartAction = _.find(actions, { type: 'PERSONAL_INFORMATION_START_SAVE_ADDRESS' })
      expect(updateAddressStartAction).toBeTruthy()

      const updateAddressEndAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS' })

      expect(updateAddressEndAction).toBeTruthy()
      expect(updateAddressEndAction?.state.personalInformation.loading).toBeFalsy()
    })
  })

  describe('finishEditAddress', () => {
    it('should update addressSaved', async () => {
      const store = realStore()
      await store.dispatch(finishEditAddress())
      const actions = store.getActions()

      const endAction = _.find(actions, { type: 'PERSONAL_INFORMATION_FINISH_EDIT_ADDRESS' })
      expect(endAction?.state.personalInformation.addressSaved).toBeFalsy()
    })
  })
})

import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import EditAddressScreen from './EditAddressScreen'
import { UserDataProfile } from 'store/api/types'
import { validateAddress, ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import { ScreenIDTypesConstants } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import { SnackbarMessages } from 'components/SnackBar'

const snackbarMessages: SnackbarMessages = {
  successMsg: 'Mailing address saved',
  errorMsg: 'Mailing address could not be saved',
}

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    validateAddress: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    deleteAddress: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),

    finishValidateAddress: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

const mockAlertSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useAlert: () => mockAlertSpy,
  }
})

jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      setOptions: jest.fn(),
      goBack: jest.fn(),
    }),
  }
})

context('EditAddressScreen', () => {
  let props: any
  let profileInfo: UserDataProfile
  let goBackSpy: any

  const initializeTestInstance = (
    profile?: UserDataProfile,
    addressSaved?: any,
    isResidential?: boolean,
    errorsState: ErrorsState = initialErrorsState,
    showValidation = false,
  ) => {
    goBackSpy = jest.fn()

    props = mockNavProps(
      {},
      {
        goBack: goBackSpy,
        addListener: jest.fn(),
      },
      {
        params: {
          displayTitle: isResidential ? 'Home Address' : 'Mailing Address',
          addressType: isResidential ? 'residentialAddress' : 'mailingAddress',
        },
      },
    )

    render(<EditAddressScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        personalInformation: {
          profile,
          loading: false,
          addressSaved,
          showValidation,
          needsDataLoad: false,
          emailSaved: false,
          preloadComplete: false,
          phoneNumberSaved: false,
        },
        errors: errorsState,
      },
    })
  }

  beforeEach(() => {
    profileInfo = {
      preferredName: 'Benny',
      firstName: 'Ben',
      middleName: 'J',
      lastName: 'Morgan',
      fullName: 'Ben J Morgan',
      genderIdentity: 'M',
      contactEmail: { emailAddress: 'ben@gmail.com', id: '0' },
      signinEmail: 'ben@gmail.com',
      birthDate: '1990-05-08',
      addresses: '',
      residentialAddress: {
        id: 0,
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
        id: 1,
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
      signinService: 'IDME',
    }

    initializeTestInstance(profileInfo)
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(profileInfo, undefined, undefined, errorState)
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })

  describe('when the address type is OVERSEAS MILITARY', () => {
    it('should initialize the checkbox with the value true', async () => {
      profileInfo.mailingAddress = {
        id: 0,
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'OVERSEAS MILITARY',
        city: 'Tiburon',
        countryCodeIso3: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      initializeTestInstance(profileInfo)
      expect(screen.getByAccessibilityValue({"text": "Filled - United States",})).toBeTruthy()
    })
  })

  describe('when the checkbox is clicked', () => {
    it('should behave correctly', async () => {
      expect(screen.queryByAccessibilityValue({"text": "Filled - United States",})).toBeFalsy()
      expect(screen.getByTestId('countryPickerTestID')).toBeTruthy()
      expect(screen.getByTestId('cityTestID')).toBeTruthy()
      expect(screen.queryByTestId('militaryPostOfficeTestID')).toBeFalsy()
      fireEvent.press(screen.getByTestId('USMilitaryBaseCheckboxTestID'))
      expect(screen.getByAccessibilityValue({"text": "Filled - United States",})).toBeTruthy()
      expect(screen.getByTestId('militaryPostOfficeTestID')).toBeTruthy()
      expect(screen.queryByTestId('cityTestID')).toBeFalsy()

      fireEvent.press(screen.getByTestId('USMilitaryBaseCheckboxTestID'))
      expect(screen.queryByAccessibilityValue({"text": "Filled - United States",})).toBeFalsy()
    })

    it('should set state, city, and military post office to empty strings', async () => {
      expect(screen.getByDisplayValue('Tiburon')).toBeTruthy()
      expect(screen.getByText('California')).toBeTruthy()
      expect(screen.getByDisplayValue('94920')).toBeTruthy()
      fireEvent.press(screen.getByTestId('USMilitaryBaseCheckboxTestID'))
      expect(screen.queryByDisplayValue('Tiburon')).toBeFalsy()
      expect(screen.queryByText('California')).toBeFalsy()
      expect(screen.queryByDisplayValue('94920')).toBeFalsy()
      fireEvent.press(screen.getByTestId('militaryPostOfficeTestID'))
      fireEvent.press(screen.getByText('APO'))
      fireEvent.press(screen.getByText('Done'))
      fireEvent.press(screen.getByTestId('USMilitaryBaseCheckboxTestID'))
      expect(screen.queryByText('APO')).toBeFalsy()
    })
  })

  describe('when the user selects a country with the picker', () => {
    it('should update the value of country and if before and after country values are not both domestic or both international should clear state and zip values otherwise retain them', async () => {
      expect(screen.getByText('California')).toBeTruthy()
      expect(screen.getByDisplayValue('94920')).toBeTruthy()

      fireEvent.press(screen.getByTestId('countryPickerTestID'))
      fireEvent.press(screen.getByText('Albania'))
      fireEvent.press(screen.getByText('Done'))
      expect(screen.getByAccessibilityValue({"text": "Filled - Albania",})).toBeTruthy()
      expect(screen.queryByText('California')).toBeFalsy()
      expect(screen.queryByDisplayValue('94920')).toBeFalsy()

      fireEvent.changeText(screen.getByTestId('cityTestID'), 'Berat')
      fireEvent.changeText(screen.getByTestId('stateTestID'), 'Rruga Antipatrea')
      fireEvent.changeText(screen.getByTestId('zipCodeTestID'), '5001')
      expect(screen.getByDisplayValue('Berat')).toBeTruthy()
      expect(screen.getByDisplayValue('Rruga Antipatrea')).toBeTruthy()
      expect(screen.getByDisplayValue('5001')).toBeTruthy()

      fireEvent.press(screen.getByTestId('countryPickerTestID'))
      fireEvent.press(screen.getByText('Algeria'))
      fireEvent.press(screen.getByText('Done'))
      expect(screen.getByDisplayValue('Berat')).toBeTruthy()
      expect(screen.getByDisplayValue('Rruga Antipatrea')).toBeTruthy()
      expect(screen.getByDisplayValue('5001')).toBeTruthy()
    })
  })

  describe('when addressSaved is true', () => {
    it('should call navigation goBack', async () => {
      initializeTestInstance(profileInfo, true)
      expect(goBackSpy).toBeCalled()
    })
  })

  describe('when showValidation is true', () => {
    it('should display the AddressValidation component', async () => {
      initializeTestInstance(profileInfo, undefined, undefined, undefined, true)
      expect(screen.getByText('You entered:')).toBeTruthy()
    })
  })

  describe('when content is invalid for domestic address', () => {
    it('should display an AlertBox and a field error for each required field', async () => {
      profileInfo.mailingAddress = {
        id: 0,
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: '',
        countryCodeIso3: '',
        internationalPostalCode: '',
        province: '',
        stateCode: '',
        zipCode: '',
        zipCodeSuffix: '',
      }

      initializeTestInstance(profileInfo)
      fireEvent.press(screen.getByText('Save'))
      expect(screen.getByText('Please check your mailing address')).toBeTruthy()
      expect(screen.getByText('Country is required')).toBeTruthy()
      expect(screen.getByText('Street address is required')).toBeTruthy()
      expect(screen.getByText('City is required')).toBeTruthy()
      expect(screen.getByText('State is required')).toBeTruthy()
      expect(screen.getByText('Postal code is required')).toBeTruthy()
    })
  })

  describe('when content is invalid for military address', () => {
    it('should display an AlertBox and a field error for each required field', async () => {
      fireEvent.press(screen.getByTestId('USMilitaryBaseCheckboxTestID'))
      fireEvent.press(screen.getByText('Save'))
      expect(screen.getByText('Please check your mailing address')).toBeTruthy()
      expect(screen.getByText('Street address is required')).toBeTruthy()
      expect(screen.getByText('Postal code is required')).toBeTruthy()
    })
  })

  describe('when content is invalid for an international address', () => {
    it('should display an AlertBox and a field error for each required field', async () => {
      fireEvent.press(screen.getByTestId('countryPickerTestID'))
      fireEvent.press(screen.getByText('Albania'))
      fireEvent.press(screen.getByText('Done'))
      fireEvent.press(screen.getByText('Save'))
      expect(screen.getByText('Please check your mailing address')).toBeTruthy()
      expect(screen.getByText('Street address is required')).toBeTruthy()
      expect(screen.getByText('City is required')).toBeTruthy()
      expect(screen.getByText('Postal code is required')).toBeTruthy()
    })
  })

  describe('when the address is residential and there is address data', () => {
    it('should display the remove button', () => {
      initializeTestInstance(profileInfo, false, true)
      expect(screen.getByText('Remove home address')).toBeTruthy()
    })
  })

  describe('validateAddress', () => {
    describe('when INTERNATIONAL', () => {
      it('should pass province and internationalPostalCode as part of the expected payload', async () => {
        profileInfo.mailingAddress = {
          id: 0,
          addressLine1: '127 Harvest Moon Dr',
          addressLine2: '',
          addressLine3: '',
          addressPou: 'CORRESPONDENCE',
          addressType: 'INTERNATIONAL',
          city: 'Bolton',
          countryCodeIso3: 'CAN',
          internationalPostalCode: 'L7E 2W1',
          province: 'Ontario',
          stateCode: '',
          zipCode: '',
        }

        initializeTestInstance(profileInfo)
        fireEvent.press(screen.getByText('Save'))

        expect(validateAddress).toBeCalledWith(
          {
            id: 0,
            addressLine1: '127 Harvest Moon Dr',
            addressLine2: '',
            addressLine3: '',
            addressPou: 'CORRESPONDENCE',
            addressType: 'INTERNATIONAL',
            city: 'Bolton',
            countryName: 'Canada',
            countryCodeIso3: 'CAN',
            internationalPostalCode: 'L7E 2W1',
            zipCode: '',
            province: 'Ontario',
          },
          snackbarMessages,
          ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID,
        )
      })
    })

    describe('when DOMESTIC', () => {
      it('should pass stateCode and zipCode as part of the expected payload', async () => {
        profileInfo.mailingAddress = {
          id: 0,
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'DOMESTIC',
          city: 'Tiburon',
          countryCodeIso3: 'USA',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }

        initializeTestInstance(profileInfo)
        fireEvent.press(screen.getByText('Save'))

        expect(validateAddress).toBeCalledWith(
          {
            id: 0,
            addressLine1: '1707 Tiburon Blvd',
            addressLine2: 'Address line 2',
            addressLine3: 'Address line 3',
            addressPou: 'CORRESPONDENCE',
            addressType: 'DOMESTIC',
            city: 'Tiburon',
            countryName: 'United States',
            countryCodeIso3: 'USA',
            stateCode: 'CA',
            zipCode: '94920',
            internationalPostalCode: '',
          },
          snackbarMessages,
          ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID,
        )
      })
    })

    describe('when OVERSEAS MILITARY', () => {
      it('should pass stateCode and zipCode as part of the expected payload', async () => {
        profileInfo.mailingAddress = {
          id: 0,
          addressLine1: 'Unit 2050 Box 4190',
          addressLine2: '',
          addressLine3: '',
          addressPou: 'CORRESPONDENCE',
          addressType: 'OVERSEAS MILITARY',
          city: 'APO',
          countryCodeIso3: 'USA',
          internationalPostalCode: '',
          province: '',
          stateCode: 'AP',
          zipCode: '96278',
        }

        initializeTestInstance(profileInfo)
        fireEvent.press(screen.getByText('Save'))

        expect(validateAddress).toBeCalledWith(
          {
            id: 0,
            addressLine1: 'Unit 2050 Box 4190',
            addressLine2: '',
            addressLine3: '',
            addressPou: 'CORRESPONDENCE',
            addressType: 'OVERSEAS MILITARY',
            countryName: 'United States',
            city: 'APO',
            countryCodeIso3: 'USA',
            internationalPostalCode: '',
            stateCode: 'AP',
            zipCode: '96278',
          },
          snackbarMessages,
          ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID,
        )
      })
    })
  })

  describe('delete address', () => {
    it('should call the useDestructive hook', async () => {
      profileInfo.residentialAddress = {
        id: 25,
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'Tiburon',
        countryCodeIso3: 'USA',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      initializeTestInstance(profileInfo, false, true)
      fireEvent.press(screen.getByText('Remove home address'))

      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'

import { context, findByTestID, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import EditAddressScreen from './EditAddressScreen'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/reducers'
import { UserDataProfile } from 'store/api/types'
import { VASelector, ErrorComponent, VAModalPicker, VATextInput, TextView, AlertBox, VAButton, BackButton } from 'components'
import { MilitaryStates } from 'constants/militaryStates'
import { States } from 'constants/states'
import { validateAddress, deleteAddress, finishValidateAddress } from 'store/actions'
import { ScreenIDTypesConstants } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import AddressValidation from './AddressValidation'

jest.mock('@react-navigation/stack', () => {
  return {
    useHeaderHeight: jest.fn().mockReturnValue(44),
    createStackNavigator: jest.fn(),
    createBottomTabNavigator: jest.fn(),
  }
})

jest.mock('../../store/actions', () => {
  let actual = jest.requireActual('../../store/actions')
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
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useDestructiveAlert: () => mockAlertSpy,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
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
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance
  let profileInfo: UserDataProfile
  let goBackSpy: any
  let navHeaderSpy: any

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
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined,
          }
        },
      },
      {
        params: {
          displayTitle: isResidential ? 'Home Address' : 'Mailing Address',
          addressType: isResidential ? 'residentialAddress' : 'mailingAddress',
        },
      },
    )

    store = mockStore({
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
    })

    act(() => {
      component = renderWithProviders(<EditAddressScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    profileInfo = {
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
      faxNumber: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901286',
        phoneType: 'HOME',
      },
      formattedFaxPhone: '(858)-690-1286',
    }

    initializeTestInstance(profileInfo)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
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
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(profileInfo, undefined, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })

  describe('when the checkbox is clicked', () => {
    it('should update the value of selected', async () => {
      const checkbox = testInstance.findByType(VASelector)
      expect(checkbox.props.selected).toEqual(false)

      const checkboxTouchable = testInstance.findAllByType(TouchableWithoutFeedback)[0]
      act(() => {
        checkboxTouchable.props.onPress()
      })
      expect(checkbox.props.selected).toEqual(true)
    })

    describe('when the checkbox is unchecked', () => {
      it('should clear the country field', async () => {
        const checkbox = testInstance.findByType(VASelector)

        const checkboxTouchable = testInstance.findAllByType(TouchableWithoutFeedback)[0]
        act(() => {
          checkboxTouchable.props.onPress()
        })
        expect(checkbox.props.selected).toEqual(true)

        act(() => {
          checkboxTouchable.props.onPress()
        })
        expect(checkbox.props.selected).toEqual(false)

        const countryPicker = testInstance.findAllByType(VAModalPicker)[0]
        expect(countryPicker.props.selectedValue).not.toBeTruthy()
      })
    })

    it('should set state, city, and military post office to empty strings', async () => {
      const checkboxTouchable = testInstance.findAllByType(TouchableWithoutFeedback)[0]
      act(() => {
        checkboxTouchable.props.onPress()
      })

      const cityVATextInput = testInstance.findAllByType(VATextInput)[3]
      expect(cityVATextInput.props.value).toEqual('')
      const statePicker = testInstance.findAllByType(VAModalPicker)[1]
      expect(statePicker.props.selectedValue).toEqual('')

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

      const checkboxTouchable2 = testInstance.findAllByType(TouchableWithoutFeedback)[0]
      act(() => {
        checkboxTouchable2.props.onPress()
      })

      const militaryPOPicker = testInstance.findAllByType(VAModalPicker)[1]
      // picker resets the value to undefined
      expect(militaryPOPicker.props.selectedValue).toBeFalsy()
    })
  })

  describe('when the user selects a country with the picker', () => {
    it('should update the value of country', async () => {
      const countryRNPickerSelect = testInstance.findAllByType(VAModalPicker)[0]
      act(() => {
        countryRNPickerSelect.props.onSelectionChange('new country value')
      })

      const countryPicker = testInstance.findAllByType(VAModalPicker)[0]
      expect(countryPicker.props.selectedValue).toEqual('new country value')
    })

    describe('when the old value and new value of country are not both domestic or both international', () => {
      it('should set state and zip code to empty strings', async () => {
        profileInfo.mailingAddress = {
          id: 0,
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'OVERSEAS MILITARY',
          city: 'Tiburon',
          countryCodeIso3: 'USA',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }
        initializeTestInstance()
        const countryRNPickerSelect = testInstance.findAllByType(VAModalPicker)[0]
        act(() => {
          countryRNPickerSelect.props.onSelectionChange('new country')
        })

        const stateVATextInput = testInstance.findAllByType(VATextInput)[4]
        expect(stateVATextInput.props.value).toEqual('')
        const zipCodeVATextInput = testInstance.findAllByType(VATextInput)[5]
        expect(zipCodeVATextInput.props.value).toEqual('')
      })
    })

    describe('when the old and new value of country are both domestic or international', () => {
      it('should keep the values of state and zip code', async () => {
        profileInfo.mailingAddress = {
          id: 0,
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'INTERNATIONAL',
          city: 'Tiburon',
          countryCodeIso3: 'AGO',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }
        initializeTestInstance(profileInfo)
        const countryRNPickerSelect = testInstance.findAllByType(VAModalPicker)[0]
        act(() => {
          countryRNPickerSelect.props.onSelectionChange('ATG')
        })

        const stateVATextInput = testInstance.findAllByType(VATextInput)[4]
        expect(stateVATextInput.props.value).toEqual('CA')
        const zipCodeVATextInput = testInstance.findAllByType(VATextInput)[5]
        expect(zipCodeVATextInput.props.value).toEqual('94920')
      })
    })
  })

  describe('when the user enters a new address line 1', () => {
    it('should update the value of addressLine1', async () => {
      const addressLine1VATextInput = testInstance.findAllByType(VATextInput)[0]
      act(() => {
        addressLine1VATextInput.props.onChange('new addressLine1')
      })
      expect(addressLine1VATextInput.props.value).toEqual('new addressLine1')
    })
  })

  describe('when the user enters a new address line 2', () => {
    it('should update the value of addressLine2', async () => {
      const addressLine2VATextInput = testInstance.findAllByType(VATextInput)[1]
      act(() => {
        addressLine2VATextInput.props.onChange('new addressLine2')
      })
      expect(addressLine2VATextInput.props.value).toEqual('new addressLine2')
    })
  })

  describe('when the user enters a new address line 3', () => {
    it('should update the value of addressLine3', async () => {
      const addressLine3VATextInput = testInstance.findAllByType(VATextInput)[2]
      act(() => {
        addressLine3VATextInput.props.onChange('new addressLine3')
      })
      expect(addressLine3VATextInput.props.value).toEqual('new addressLine3')
    })
  })

  describe('when the user enters a new city', () => {
    it('should update the value of city', async () => {
      const cityVATextInput = testInstance.findAllByType(VATextInput)[3]
      act(() => {
        cityVATextInput.props.onChange('new city')
      })
      expect(cityVATextInput.props.value).toEqual('new city')
    })
  })

  describe('when the user selects a military post office with the picker', () => {
    it('should update the value of militaryPostOffice', async () => {
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

      const militaryPostOfficeRNPickerSelect = testInstance.findAllByType(VAModalPicker)[1]
      act(() => {
        militaryPostOfficeRNPickerSelect.props.onSelectionChange('APO')
      })

      const militaryPOPicker = testInstance.findAllByType(VAModalPicker)[1]
      expect(militaryPOPicker.props.selectedValue).toEqual('APO')
    })
  })

  describe('when the user selects a state with the picker', () => {
    it('should update the value of state', async () => {
      const stateRNPickerSelect = testInstance.findAllByType(VAModalPicker)[1]
      act(() => {
        stateRNPickerSelect.props.onSelectionChange('NY')
      })

      const statePicker = testInstance.findAllByType(VAModalPicker)[1]
      expect(statePicker.props.selectedValue).toEqual('NY')
    })
  })

  describe('when the user enters a new zip code', () => {
    it('should update the value of zip code', async () => {
      const zipCodeVATextInput = testInstance.findAllByType(VATextInput)[4]
      act(() => {
        zipCodeVATextInput.props.onChange('new zipcode')
      })
      expect(zipCodeVATextInput.props.value).toEqual('new zipcode')
    })
  })

  describe('when a text input item does not exist', () => {
    it('should set it to an empty string initially', async () => {
      initializeTestInstance()
      const addressLine1VATextInput = testInstance.findAllByType(VATextInput)[0]
      expect(addressLine1VATextInput.props.value).toEqual('')
    })
  })

  describe('when a picker item does not exist', () => {
    it('should set it to an empty string initially', async () => {
      initializeTestInstance()
      const statePicker = testInstance.findAllByType(VAModalPicker)[1]
      expect(statePicker.props.selectedValue).toEqual('')
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

      const checkbox = testInstance.findByType(VASelector)
      expect(checkbox.props.selected).toEqual(true)
    })
  })

  describe('when the address type is not OVERSEAS MILITARY', () => {
    it('should initialize the checkbox with the value false', async () => {
      const checkbox = testInstance.findByType(VASelector)
      expect(checkbox.props.selected).toEqual(false)
    })
  })

  describe('when checkboxSelected is true', () => {
    beforeEach(async () => {
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
    })

    describe('when the country is not already USA', () => {
      it('should set country to USA', async () => {
        const countryPicker = testInstance.findAllByType(VAModalPicker)[0]
        expect(countryPicker.props.selectedValue).toEqual('USA')
      })
    })

    it('should disable the country picker', async () => {
      const countryPicker = testInstance.findAllByType(VAModalPicker)[0]
      expect(countryPicker.props.disabled).toEqual(true)
    })

    it('should set the state picker pickerOptions to MilitaryStates', async () => {
      const statePicker = testInstance.findAllByType(VAModalPicker)[2]
      expect(statePicker.props.pickerOptions).toEqual(MilitaryStates)
    })

    it('should render the military post office picker instead of the city text input', async () => {
      const pickers = testInstance.findAllByType(VAModalPicker)
      expect(pickers[1].props.labelKey).toEqual('profile:editAddress.militaryPostOffices')

      const textInputs = testInstance.findAllByType(VATextInput)
      expect(textInputs[0].props.labelKey).toEqual('profile:editAddress.streetAddressLine1')
      expect(textInputs[1].props.labelKey).toEqual('profile:editAddress.streetAddressLine2')
      expect(textInputs[2].props.labelKey).toEqual('profile:editAddress.streetAddressLine3')
      expect(textInputs[3].props.labelKey).toEqual('profile:editAddress.zipCode')
    })
  })

  describe('when checkboxSelected is false', () => {
    it('should set the state picker pickerOptions to States', async () => {
      const statePicker = testInstance.findAllByType(VAModalPicker)[1]
      expect(statePicker.props.pickerOptions).toEqual(States)
    })

    it('should enable the country picker', async () => {
      const countryPicker = testInstance.findAllByType(VAModalPicker)[0]
      expect(countryPicker.props.disabled).toEqual(false)
    })

    it('should render the city text input instead of the military post office picker', async () => {
      const textInputs = testInstance.findAllByType(VATextInput)
      expect(textInputs[3].props.labelKey).toEqual('profile:editAddress.city')

      const pickers = testInstance.findAllByType(VAModalPicker)
      expect(pickers[0].props.labelKey).toEqual('profile:editAddress.country')
      expect(pickers[1].props.labelKey).toEqual('profile:editAddress.state')
    })
  })

  describe('when the country is domestic', () => {
    it('should render state picker', async () => {
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

      const statePicker = testInstance.findAllByType(VAModalPicker)[1]
      expect(statePicker.props.labelKey).toEqual('profile:editAddress.state')
    })
  })

  describe('when the country is not domestic', () => {
    it('should render state text input', async () => {
      profileInfo.mailingAddress = {
        id: 0,
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'INTERNATIONAL',
        city: 'Tiburon',
        countryCodeIso3: 'ALB',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      initializeTestInstance(profileInfo)

      const stateVATextInput = testInstance.findAllByType(VATextInput)[4]
      expect(stateVATextInput.props.labelKey).toEqual('profile:editAddress.state')
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
      expect(testInstance.findAllByType(AddressValidation).length).toEqual(1)
    })

    it('when cancel is pressed during address validation', async () => {
      initializeTestInstance(profileInfo, undefined, undefined, undefined, true)

      navHeaderSpy.back.props.onPress()
      expect(finishValidateAddress).toBeCalled()
      expect(goBackSpy).toBeCalled()
    })
  })

  describe('when content is invalid for domestic address', () => {
    it('should display an AlertBox and a field error for each required field', async () => {
      act(() => {
        const pickers = testInstance.findAllByType(VAModalPicker)
        pickers.forEach((picker) => {
          picker.props.onSelectionChange('')
        })

        const textInputs = testInstance.findAllByType(VATextInput)
        textInputs.forEach((textInput) => {
          textInput.props.onChange('')
        })

        navHeaderSpy.save.props.onSave()
      })

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      const textViews = testInstance.findAllByType(TextView)

      // TODO: find a better way to pick the right textview
      expect(textViews[238].props.children).toEqual('Country is required')
      expect(textViews[243].props.children).toEqual('Street address is required')
      expect(textViews[251].props.children).toEqual('City is required')
      expect(textViews[324].props.children).toEqual('State is required')
      expect(textViews[328].props.children).toEqual('Zip code is required')
    })
  })

  describe('when content is invalid for military address', () => {
    it('should display an AlertBox and a field error for each required field', async () => {
      act(() => {
        testInstance.findByType(VASelector).props.onSelectionChange(true)
      })

      act(() => {
        navHeaderSpy.save.props.onSave()
      })

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      const textViews = testInstance.findAllByType(TextView)

      expect(textViews[242].props.children).toEqual('Street address is required')
      expect(textViews[258].props.children).toEqual('Please select a valid option')
      expect(textViews[270].props.children).toEqual('Please select a valid option')
      expect(textViews[274].props.children).toEqual('Zip code is required')
    })
  })

  describe('when content is invalid for an international address', () => {
    it('should display an AlertBox and a field error for each required field', async () => {
      act(() => {
        testInstance.findAllByType(VAModalPicker)[0].props.onSelectionChange('AFG')
      })

      act(() => {
        navHeaderSpy.save.props.onSave()
      })

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      const textViews = testInstance.findAllByType(TextView)

      expect(textViews[242].props.children).toEqual('Street address is required')
      expect(textViews[250].props.children).toEqual('City is required')
      expect(textViews[255].props.children).toEqual('Postal code is required')
    })
  })

  describe('when the address is residential and there is address data', () => {
    it('should display the remove button', () => {
      initializeTestInstance(profileInfo, false, true)
      const buttons = testInstance.findAllByType(VAButton)
      expect(buttons[buttons.length - 1].props.label).toEqual('Remove Home Address')
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

        act(() => {
          navHeaderSpy.save.props.onSave()
        })

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

        act(() => {
          navHeaderSpy.save.props.onSave()
        })

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

        act(() => {
          navHeaderSpy.save.props.onSave()
        })

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

      act(() => {
        testInstance.findByType(VAButton).props.onPress()
      })

      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })
})

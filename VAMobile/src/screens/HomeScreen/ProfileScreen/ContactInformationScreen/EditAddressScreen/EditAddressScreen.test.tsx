import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'

import { context, findByTypeWithText, mockNavProps, QueriesData, render, RenderAPI, waitFor } from 'testUtils'
import EditAddressScreen from './EditAddressScreen'
import { VASelector, VAModalPicker, VATextInput, TextView, AlertBox, VAButton } from 'components'
import { MilitaryStates } from 'constants/militaryStates'
import { States } from 'constants/states'
import { SnackbarMessages } from 'components/SnackBar'
import { AddressData, UserContactInformation } from 'api/types'
import { contactInformationKeys } from 'api/contactInformation/queryKeys'
import { post } from 'store/api'

const snackbarMessages: SnackbarMessages = {
  successMsg: 'Mailing address saved',
  errorMsg: 'Mailing address could not be saved',
}

const residentialAddress: AddressData = {
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
}
const mailingAddress: AddressData = {
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
}

jest.mock('@react-navigation/stack', () => {
  return {
    useHeaderHeight: jest.fn().mockReturnValue(44),
    createStackNavigator: jest.fn(),
    createBottomTabNavigator: jest.fn(),
  }
})

const mockAlertSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
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
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let goBackSpy: any

  const getSaveButton = () => testInstance.findAllByType(TouchableWithoutFeedback)[1]

  const initializeTestInstance = (
    isResidential?: boolean, contactInformation?: Partial<UserContactInformation>

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

    let queriesData

    if (contactInformation) {
      queriesData = [{
        queryKey: contactInformationKeys.contactInformation,
        data: {
          ...contactInformation
        }
      }] as QueriesData
    }

    component = render(<EditAddressScreen {...props} />, undefined, queriesData)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the checkbox is clicked', () => {
    it('should update the value of selected', async () => {
      const checkbox = testInstance.findByType(VASelector)
      expect(checkbox.props.selected).toEqual(false)
      const checkboxTouchable = testInstance.findAllByType(TouchableWithoutFeedback)[2]
      act(() => {
        checkboxTouchable.props.onPress()
      })
      expect(checkbox.props.selected).toEqual(true)
    })

    describe('when the checkbox is unchecked', () => {
      it('should clear the country field', async () => {
        const checkbox = testInstance.findByType(VASelector)

        const checkboxTouchable = testInstance.findAllByType(TouchableWithoutFeedback)[2]
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
      const checkboxTouchable = testInstance.findAllByType(TouchableWithoutFeedback)[2]
      act(() => {
        checkboxTouchable.props.onPress()
      })

      const cityVATextInput = testInstance.findAllByType(VATextInput)[3]
      expect(cityVATextInput.props.value).toEqual('')
      const statePicker = testInstance.findAllByType(VAModalPicker)[1]
      expect(statePicker.props.selectedValue).toEqual('')

      const mailingAddress: AddressData = {
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

      initializeTestInstance(undefined, {mailingAddress})

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
        const mailingAddress: AddressData = {
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
        initializeTestInstance(undefined, { mailingAddress })
        const countryRNPickerSelect = testInstance.findAllByType(VAModalPicker)[0]
        act(() => {
          countryRNPickerSelect.props.onSelectionChange('new country')
        })

        // const stateVATextInput = testInstance.findAllByType(VATextInput)[4]
        // expect(stateVATextInput.props.value).toEqual('')
        // const zipCodeVATextInput = testInstance.findAllByType(VATextInput)[5]
        // expect(zipCodeVATextInput.props.value).toEqual('')
      })
    })

    describe('when the old and new value of country are both domestic or international', () => {
      it('should keep the values of state and zip code', async () => {
        const mailingAddress: AddressData = {
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
        initializeTestInstance(undefined, { mailingAddress })
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
      const mailingAddress: AddressData = {
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

      initializeTestInstance(undefined, { mailingAddress })

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
      const mailingAddress: AddressData = {
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

      initializeTestInstance(undefined, { mailingAddress })

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
      const mailingAddress: AddressData = {
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

      initializeTestInstance(undefined, { mailingAddress })
    })

    describe('when the country is not already USA', () => {
      it('should set country to USA', async () => {
        const countryPicker = testInstance.findAllByType(VAModalPicker)[0]
        expect(countryPicker.props.selectedValue).toEqual('USA')
      })
    })

    it('should disable and hide the country picker', async () => {
      const countryPicker = testInstance.findAllByType(VAModalPicker)[0]
      expect(countryPicker.props.disabled).toEqual(true)
      expect(countryPicker.parent?.props.display).toEqual('none')
    })

    it('should set the state picker pickerOptions to MilitaryStates', async () => {
      const statePicker = testInstance.findAllByType(VAModalPicker)[2]
      expect(statePicker.props.pickerOptions).toEqual(MilitaryStates)
    })

    it('should render the military post office picker instead of the city text input', async () => {
      const pickers = testInstance.findAllByType(VAModalPicker)
      expect(pickers[1].props.labelKey).toEqual('editAddress.militaryPostOffices')

      const textInputs = testInstance.findAllByType(VATextInput)
      expect(textInputs[0].props.labelKey).toEqual('editAddress.streetAddressLine1')
      expect(textInputs[1].props.labelKey).toEqual('editAddress.streetAddressLine2')
      expect(textInputs[2].props.labelKey).toEqual('editAddress.streetAddressLine3')
      expect(textInputs[3].props.labelKey).toEqual('editAddress.zipCode')
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
      expect(textInputs[3].props.labelKey).toEqual('editAddress.city')

      const pickers = testInstance.findAllByType(VAModalPicker)
      expect(pickers[0].props.labelKey).toEqual('editAddress.country')
      expect(pickers[1].props.labelKey).toEqual('editAddress.state')
    })
  })

  describe('when the country is domestic', () => {
    it('should render state picker', async () => {
      const mailingAddress: AddressData = {
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

      initializeTestInstance(undefined, { mailingAddress })

      const statePicker = testInstance.findAllByType(VAModalPicker)[1]
      expect(statePicker.props.labelKey).toEqual('editAddress.state')
    })
  })

  describe('when the country is not domestic', () => {
    it('should render state text input', async () => {
      const mailingAddress: AddressData = {
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

      initializeTestInstance(undefined, { mailingAddress })

      const stateVATextInput = testInstance.findAllByType(VATextInput)[4]
      expect(stateVATextInput.props.labelKey).toEqual('editAddress.state')
    })
  })

  // describe('when addressSaved is true', () => {
  //   it('should call navigation goBack', async () => {
  //     initializeTestInstance(true, { mailingAddress, residentialAddress })
  //     getSaveButton().props.onPress()

  //     expect(goBackSpy).toBeCalled()
  //   })
  // })

  // describe('when showValidation is true', () => {
  //   it('should display the AddressValidation component', async () => {
  //     initializeTestInstance(undefined, { mailingAddress, residentialAddress })
  //     getSaveButton().props.onPress()

  //     await waitFor(() => expect(post).toBeCalledWith('/v0/user/addresses/validate', residentialAddress))
  //     // await waitFor(() => expect(testInstance.findAllByType(AddressValidation).length).toEqual(1))
  //   })
  // })

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

        getSaveButton().props.onPress()
      })

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)

      // TODO: find a better way to pick the right textview
      expect(findByTypeWithText(testInstance, TextView, 'Country is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Street address is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'City is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'State is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Postal code is required')).toBeTruthy()
    })
  })

  describe('when content is invalid for military address', () => {
    it('should display an AlertBox and a field error for each required field', async () => {
      act(() => {
        testInstance.findByType(VASelector).props.onSelectionChange(true)
      })

      act(() => {
        getSaveButton().props.onPress()
      })

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(findByTypeWithText(testInstance, TextView, 'Street address is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Postal code is required')).toBeTruthy()
    })
  })

  describe('when content is invalid for an international address', () => {
    it('should display an AlertBox and a field error for each required field', async () => {
      act(() => {
        testInstance.findAllByType(VAModalPicker)[0].props.onSelectionChange('AFG')
      })

      act(() => {
        getSaveButton().props.onPress()
      })

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(findByTypeWithText(testInstance, TextView, 'Street address is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'City is required')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Postal code is required')).toBeTruthy()
    })
  })

  describe('when the address is residential and there is address data', () => {
    it('should display the remove button', () => {
      initializeTestInstance(true, { residentialAddress, mailingAddress })
      const buttons = testInstance.findAllByType(VAButton)
      expect(buttons[buttons.length - 1].props.label).toEqual('Remove home address')
    })
  })

  describe('validateAddress', () => {
    describe('when INTERNATIONAL', () => {
      it('should pass province and internationalPostalCode as part of the expected payload', async () => {
        const mailingAddress: AddressData = {
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

        initializeTestInstance(undefined, { mailingAddress })

        act(() => {
          getSaveButton().props.onPress()
        })

        await waitFor(() => expect(post).toBeCalledWith('/v0/user/addresses/validate',
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
        ))
      })
    })

    describe('when DOMESTIC', () => {
      it('should pass stateCode and zipCode as part of the expected payload', async () => {
        const mailingAddress: AddressData = {
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

        initializeTestInstance(undefined, { mailingAddress })

        act(() => {
          getSaveButton().props.onPress()
        })

        await waitFor(() => (expect(post).toBeCalledWith('/v0/user/addresses/validate',
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
        )))
      })
    })

    describe('when OVERSEAS MILITARY', () => {
      it('should pass stateCode and zipCode as part of the expected payload', async () => {
        const mailingAddress: AddressData = {
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

        initializeTestInstance(undefined, { mailingAddress })
        act(() => {
          getSaveButton().props.onPress()
        })

        await waitFor(() => expect(post).toBeCalledWith('/v0/user/addresses/validate', {
          addressLine1: 'Unit 2050 Box 4190', 
          addressLine2: '', 
          addressLine3: '',
          addressPou: "CORRESPONDENCE", 
          addressType: "OVERSEAS MILITARY", 
          city: 'APO', 
          countryCodeIso3: "USA", 
          countryName: "United States", 
          id: 0, 
          internationalPostalCode: "", 
          stateCode: "AP", "zipCode": "96278"
        }))
      })
    })
  })

  describe('delete address', () => {
    it('should call the useDestructive hook', async () => {
      const residentialAddress: AddressData = {
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

      initializeTestInstance(true, { residentialAddress })

      act(() => {
        testInstance.findByType(VAButton).props.onPress()
      })

      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })
})

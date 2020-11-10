import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {TouchableWithoutFeedback} from 'react-native'
import RNPickerSelect  from 'react-native-picker-select'
import {StackNavigationOptions} from '@react-navigation/stack/lib/typescript/src/types'

import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import EditAddressScreen from './EditAddressScreen'
import { InitialState } from 'store/reducers'
import { UserDataProfile } from 'store/api/types'
import {CheckBox, VAPicker, StyledTextInput, VATextInput} from 'components'
import { MilitaryStates } from 'constants/militaryStates'
import { States } from 'constants/states'
import {finishEditAddress, updateTabBarVisible} from 'store/actions'

jest.mock('../../store/actions', () => {
  let actual = jest.requireActual('../../store/actions')
  return {
    ...actual,
    updateTabBarVisible: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
    finishEditAddress: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    }),
  }
})

context('EditAddressScreen', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance
  let profileInfo: UserDataProfile
  let navHeaderSpy: any
  let goBackSpy: any

  const initializeTestInstance = (profile?: UserDataProfile, addressUpdated?: any) => {
    goBackSpy = jest.fn()

    props = mockNavProps(
      {},
      {
        goBack: goBackSpy,
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined
          }
        },
      },
      {
        params: {
          displayTitle: 'Mailing Address',
          addressType: 'mailing_address'
        }
      }
    )

    store = mockStore({
      ...InitialState,
      personalInformation: { profile, loading: false, addressUpdated }
    })

    act(() => {
      component = renderWithProviders(<EditAddressScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    profileInfo = {
      first_name: 'Ben',
      middle_name: 'J',
      last_name: 'Morgan',
      full_name: 'Ben J Morgan',
      email: 'ben@gmail.com',
      birth_date: '1990-05-08',
      gender: 'M',
      addresses: '',
      residential_address: {
        addressLine1: '10 Laurel Way',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'Novato',
        countryCode: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      },
      mailing_address: {
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'Tiburon',
        countryCode: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      },
      home_phone: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901289',
        phoneType: 'HOME',
      },
      formatted_home_phone: '(858)-690-1289',
      mobile_phone: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901288',
        phoneType: 'HOME',
      },
      formatted_mobile_phone: '(858)-690-1288',
      work_phone: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901287',
        phoneType: 'HOME',
      },
      formatted_work_phone: '(858)-690-1287',
      fax_phone: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901286',
        phoneType: 'HOME',
      },
      formatted_fax_phone: '(858)-690-1286',
      most_recent_branch: '',
    }

    initializeTestInstance(profileInfo)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call updateTabBarVisible with false', async () => {
    expect(updateTabBarVisible).toHaveBeenNthCalledWith(1, false)
  })

  describe('when the checkbox is clicked', () => {
    it('should update the value of selected', async () => {
      const checkbox = testInstance.findByType(CheckBox)
      expect(checkbox.props.selected).toEqual(false)

      const checkboxTouchable = testInstance.findAllByType(TouchableWithoutFeedback)[0]
      checkboxTouchable.props.onPress()
      expect(checkbox.props.selected).toEqual(true)
    })

    it('should set state, city, and military post office to empty strings', async () => {
      const checkboxTouchable = testInstance.findAllByType(TouchableWithoutFeedback)[0]
      checkboxTouchable.props.onPress()

      const cityVATextInput = testInstance.findAllByType(VATextInput)[3]
      expect(cityVATextInput.props.value).toEqual('')
      const statePicker = testInstance.findAllByType(VAPicker)[1]
      expect(statePicker.props.selectedValue).toEqual('')

      profileInfo.mailing_address = {
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'OVERSEAS MILITARY',
        city: 'Tiburon',
        countryCode: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      initializeTestInstance(profileInfo)

      const checkboxTouchable2 = testInstance.findAllByType(TouchableWithoutFeedback)[0]
      checkboxTouchable2.props.onPress()

      const militaryPOPicker = testInstance.findAllByType(VAPicker)[1]
      expect(militaryPOPicker.props.selectedValue).toEqual('')
    })
  })

  describe('when the user selects a country with the picker', () => {
    it('should update the value of country', async () => {
      const countryRNPickerSelect = testInstance.findAllByType(RNPickerSelect)[0]
      countryRNPickerSelect.props.onValueChange('new country value')

      const countryPicker = testInstance.findAllByType(VAPicker)[0]
      expect(countryPicker.props.selectedValue).toEqual('new country value')
    })

    describe('when the old value and new value of country are not both domestic or both international', () => {
      it('should set state and zip code to empty strings', async () => {
        profileInfo.mailing_address = {
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'OVERSEAS MILITARY',
          city: 'Tiburon',
          countryCode: 'USA',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }
        initializeTestInstance()
        const countryRNPickerSelect = testInstance.findAllByType(RNPickerSelect)[0]
        countryRNPickerSelect.props.onValueChange('new country')

        const stateVATextInput = testInstance.findAllByType(VATextInput)[4]
        expect(stateVATextInput.props.value).toEqual('')
        const zipCodeVATextInput = testInstance.findAllByType(VATextInput)[5]
        expect(zipCodeVATextInput.props.value).toEqual('')
      })
    })

    describe('when the old and new value of country are both domestic or international', () => {
      it('should keep the values of state and zip code', async () => {
        profileInfo.mailing_address = {
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'INTERNATIONAL',
          city: 'Tiburon',
          countryCode: 'AGO',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }
        initializeTestInstance(profileInfo)
        const countryRNPickerSelect = testInstance.findAllByType(RNPickerSelect)[0]
        countryRNPickerSelect.props.onValueChange('ATG')

        const stateVATextInput = testInstance.findAllByType(VATextInput)[4]
        expect(stateVATextInput.props.value).toEqual('CA')
        const zipCodeVATextInput = testInstance.findAllByType(VATextInput)[5]
        expect(zipCodeVATextInput.props.value).toEqual('94920')
      })
    })
  })

  describe('when the user enters a new address line 1', () => {
    it('should update the value of addressLine1', async () => {
      const addressLine1TextInput = testInstance.findAllByType(StyledTextInput)[0]
      addressLine1TextInput.props.onChangeText('new addressLine1')

      const addressLine1VATextInput = testInstance.findAllByType(VATextInput)[0]
      expect(addressLine1VATextInput.props.value).toEqual('new addressLine1')
    })
  })

  describe('when the user enters a new address line 2', () => {
    it('should update the value of addressLine2', async () => {
      const addressLine2TextInput = testInstance.findAllByType(StyledTextInput)[1]
      addressLine2TextInput.props.onChangeText('new addressLine2')

      const addressLine2VATextInput = testInstance.findAllByType(VATextInput)[1]
      expect(addressLine2VATextInput.props.value).toEqual('new addressLine2')
    })
  })

  describe('when the user enters a new address line 3', () => {
    it('should update the value of addressLine3', async () => {
      const addressLine3TextInput = testInstance.findAllByType(StyledTextInput)[2]
      addressLine3TextInput.props.onChangeText('new addressLine3')

      const addressLine3VATextInput = testInstance.findAllByType(VATextInput)[2]
      expect(addressLine3VATextInput.props.value).toEqual('new addressLine3')
    })
  })

  describe('when the user enters a new city', () => {
    it('should update the value of city', async () => {
      const cityTextInput = testInstance.findAllByType(StyledTextInput)[3]
      cityTextInput.props.onChangeText('new city')

      const cityVATextInput = testInstance.findAllByType(VATextInput)[3]
      expect(cityVATextInput.props.value).toEqual('new city')
    })
  })

  describe('when the user selects a military post office with the picker', () => {
    it('should update the value of militaryPostOffice', async () => {
      profileInfo.mailing_address = {
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'OVERSEAS MILITARY',
        city: 'Tiburon',
        countryCode: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      initializeTestInstance(profileInfo)

      const militaryPostOfficeRNPickerSelect = testInstance.findAllByType(RNPickerSelect)[1]
      militaryPostOfficeRNPickerSelect.props.onValueChange('APO')

      const militaryPOPicker = testInstance.findAllByType(VAPicker)[1]
      expect(militaryPOPicker.props.selectedValue).toEqual('APO')
    })
  })

  describe('when the user selects a state with the picker', () => {
    it('should update the value of state', async () => {
      const stateRNPickerSelect = testInstance.findAllByType(RNPickerSelect)[1]
      stateRNPickerSelect.props.onValueChange('NY')

      const statePicker = testInstance.findAllByType(VAPicker)[1]
      expect(statePicker.props.selectedValue).toEqual('NY')
    })
  })

  describe('when the user enters a new zip code', () => {
    it('should update the value of zip code', async () => {
      const zipCodeTextInput = testInstance.findAllByType(StyledTextInput)[4]
      zipCodeTextInput.props.onChangeText('new zipcode')

      const zipCodeVATextInput = testInstance.findAllByType(VATextInput)[4]
      expect(zipCodeVATextInput.props.value).toEqual('new zipcode')
    })
  })

  describe('when a text input item does not exist', () => {
    it('should set it to an empty string initially', async() => {
      initializeTestInstance()
      const addressLine1VATextInput = testInstance.findAllByType(VATextInput)[0]
      expect(addressLine1VATextInput.props.value).toEqual('')
    })
  })

  describe('when a picker item does not exist', () => {
    it('should set it to an empty string initially', async() => {
      initializeTestInstance()
      const statePicker = testInstance.findAllByType(VAPicker)[1]
      expect(statePicker.props.selectedValue).toEqual('')
    })
  })

  describe('when the address type is OVERSEAS MILITARY', () => {
    it('should initialize the checkbox with the value true', async () => {
      profileInfo.mailing_address = {
        addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'OVERSEAS MILITARY',
          city: 'Tiburon',
          countryCode: '1',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
      }

      initializeTestInstance(profileInfo)

      const checkbox = testInstance.findByType(CheckBox)
      expect(checkbox.props.selected).toEqual(true)
    })
  })

  describe('when the address type is not OVERSEAS MILITARY', () => {
    it('should initialize the checkbox with the value false', async () => {
      const checkbox = testInstance.findByType(CheckBox)
      expect(checkbox.props.selected).toEqual(false)
    })
  })

  describe('when checkboxSelected is true', () => {
    beforeEach(async () => {
      profileInfo.mailing_address = {
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'OVERSEAS MILITARY',
        city: 'Tiburon',
        countryCode: '1',
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
        const countryPicker = testInstance.findAllByType(VAPicker)[0]
        expect(countryPicker.props.selectedValue).toEqual('USA')
      })

      it('should set the zip code to an empty string', async () => {
        const zipCodeVATextInput = testInstance.findAllByType(VATextInput)[3]
        expect(zipCodeVATextInput.props.value).toEqual('')
      })
    })


    it('should disable the country picker', async () => {
      const countryPicker = testInstance.findAllByType(VAPicker)[0]
      expect(countryPicker.props.disabled).toEqual(true)
    })

    it('should set the state picker pickerOptions to MilitaryStates', async () =>{
      const statePicker = testInstance.findAllByType(VAPicker)[2]
      expect(statePicker.props.pickerOptions).toEqual(MilitaryStates)
    })

    it('should render the military post office picker instead of the city text input', async () => {
      const picker = findByTestID(testInstance, 'military-post-office-picker')
      expect(picker).toBeTruthy()

      const textInput = testInstance.findAllByProps({ testID: 'city-text-input' })
      expect(textInput.length).toEqual(0)
    })

    describe('when addressLine1, militaryPostOffice, state, and zip code exist', () => {
      it('should enable the save button', async () => {
        profileInfo.mailing_address = {
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'OVERSEAS MILITARY',
          city: 'APO',
          countryCode: 'USA',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }

        initializeTestInstance(profileInfo)
        expect(navHeaderSpy.save.props.disabled).toEqual(false)
      })
    })

    describe('when one item from addressLine1, militaryPostOffice, state, and zip code does not exist', () => {
      it('should disable the save button', async () => {
        profileInfo.mailing_address = {
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'OVERSEAS MILITARY',
          city: 'Tiburon',
          countryCode: '1',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '',
          zipCodeSuffix: '1234',
        }

        initializeTestInstance(profileInfo)
        expect(navHeaderSpy.save.props.disabled).toEqual(true)
      })
    })
  })

  describe('when checkboxSelected is false', () => {
    it('should set the state picker pickerOptions to States', async () =>{
      const statePicker = testInstance.findAllByType(VAPicker)[1]
      expect(statePicker.props.pickerOptions).toEqual(States)
    })

    it('should enable the country picker', async () => {
      const countryPicker = testInstance.findAllByType(VAPicker)[0]
      expect(countryPicker.props.disabled).toEqual(false)
    })

    it('should render the city text input instead of the military post office picker', async () => {
      const textInput = findByTestID(testInstance, 'city-text-input')
      expect(textInput).toBeTruthy()

      const picker = testInstance.findAllByProps({ testID: 'military-post-office-picker' })
      expect(picker.length).toEqual(0)
    })
  })

  describe('when the country is domestic', () => {
    beforeEach(async () => {
      profileInfo.mailing_address = {
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'Tiburon',
        countryCode: 'USA',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      initializeTestInstance(profileInfo)
    })
    it('should render state picker', async () => {
      const statePicker = testInstance.findAllByType(VAPicker)[1]
      expect(statePicker.props.placeholderKey).toEqual('profile:editAddress.statePlaceholder')
    })

    describe('when country, addressLine1, city, state, and zip code exist', () => {
      it('should enable the save button', async () => {
        expect(navHeaderSpy.save.props.disabled).toEqual(false)
      })
    })

    describe('when one item from country, addressLine1, city, state, and zip code does not exist', () => {
      it('should disable the save button', async () => {
        profileInfo.mailing_address = {
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'DOMESTIC',
          city: 'Tiburon',
          countryCode: 'USA',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '',
          zipCodeSuffix: '1234',
        }

        initializeTestInstance(profileInfo)
        expect(navHeaderSpy.save.props.disabled).toEqual(true)
      })
    })
  })

  describe('when the country is not domestic', () => {
    beforeEach(async () => {
      profileInfo.mailing_address = {
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'INTERNATIONAL',
        city: 'Tiburon',
        countryCode: 'ALB',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      initializeTestInstance(profileInfo)
    })
    it('should render state text input', async () => {
      const stateVATextInput = testInstance.findAllByType(VATextInput)[4]
      expect(stateVATextInput.props.placeholderKey).toEqual('profile:editAddress.state')
    })


    describe('when addressLine1, city, and zip code exist', () => {
      it('should enable the save button', async () => {
        expect(navHeaderSpy.save.props.disabled).toEqual(false)
      })
    })

    describe('when one item from addressLine1, city, and zip code does not exist', () => {
      it('should disable the save button', async () => {
        profileInfo.mailing_address = {
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'INTERNATIONAL',
          city: 'Tiburon',
          countryCode: 'ALB',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '',
          zipCodeSuffix: '1234',
        }

        initializeTestInstance(profileInfo)
        expect(navHeaderSpy.save.props.disabled).toEqual(true)
      })
    })
  })

  describe('when addressUpdated is true', () => {
    it('should call navigation goBack, finishEditAddress, and updateTabBarVisible with true', async () => {
      initializeTestInstance(profileInfo, true)
      expect(goBackSpy).toBeCalled()
      expect(finishEditAddress).toBeCalled()
      expect(updateTabBarVisible).lastCalledWith(true)
    })
  })

  describe('when back button is pressed', () => {
    it('should call navigation goBack and updateTabBarVisible with true', async () => {
      navHeaderSpy.back.props.onPress()
      expect(goBackSpy).toBeCalled()
      expect(updateTabBarVisible).lastCalledWith(true)
    })
  })
})

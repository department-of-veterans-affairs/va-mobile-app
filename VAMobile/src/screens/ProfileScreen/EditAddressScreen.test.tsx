import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {TouchableWithoutFeedback} from 'react-native'
import RNPickerSelect  from 'react-native-picker-select'

import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import EditAddressScreen from './EditAddressScreen'
import { InitialState } from 'store/reducers'
import { UserDataProfile } from 'store/api/types'
import {CheckBox, VAPicker, StyledTextInput, VATextInput} from 'components'

context('EditAddressScreen', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance
  let profileInfo: UserDataProfile

  const initializeTestInstance = (profile?: UserDataProfile) => {
    props = mockNavProps(
      {},
      {
        setOptions: jest.fn()
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
      personalInformation: { profile, loading: false }
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

  describe('when the checkbox is clicked', () => {
    it('should update the value of selected', async () => {
      const checkbox = testInstance.findByType(CheckBox)
      expect(checkbox.props.selected).toEqual(false)

      const checkboxTouchable = testInstance.findAllByType(TouchableWithoutFeedback)[0]
      checkboxTouchable.props.onPress()
      expect(checkbox.props.selected).toEqual(true)
    })
  })

  describe('when the user selects a country with the picker', () => {
    it('should update the value of country', async () => {
      const countryRNPickerSelect = testInstance.findAllByType(RNPickerSelect)[0]
      countryRNPickerSelect.props.onValueChange('new country value')

      const countryPicker = testInstance.findAllByType(VAPicker)[0]
      expect(countryPicker.props.selectedValue).toEqual('new country value')
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
      const zipCodeTextInput = testInstance.findAllByType(StyledTextInput)[3]
      zipCodeTextInput.props.onChangeText('new city')

      const zipCodeVATextInput = testInstance.findAllByType(VATextInput)[3]
      expect(zipCodeVATextInput.props.value).toEqual('new city')
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
})

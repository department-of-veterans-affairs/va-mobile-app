import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import EditDirectDepositScreen from './EditDirectDepositScreen'
import { InitialState } from 'store/reducers'
import { StyledTextInput, VAPicker, VATextInput } from 'components'
import RNPickerSelect  from 'react-native-picker-select'

context('EditDirectDepositScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  beforeEach(() => {

    store = mockStore({
      ...InitialState,
    })

    props = mockNavProps(
        {},
        {
          navigate: jest.fn(),
          setOptions: jest.fn(),
        }
    )

    act(() => {
      component = renderWithProviders(<EditDirectDepositScreen {...props} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when user enters a routing number', () => {
    it('should update the value of routingNumber', async () => {
      const routingNumberTextInput = testInstance.findAllByType(StyledTextInput)[0]
      routingNumberTextInput.props.onChangeText('123456789')

      const routingNumberVATextInput = testInstance.findAllByType(VATextInput)[0]
      expect(routingNumberVATextInput.props.value).toEqual('123456789')
    })
  })

  describe('when user enters an account number', () => {
    it('should update the value of accountNumber', async () => {
      const accountNumberTextInput = testInstance.findAllByType(StyledTextInput)[1]
      accountNumberTextInput.props.onChangeText('12345678901234567')

      const accountNumberVATextInput = testInstance.findAllByType(VATextInput)[1]
      expect(accountNumberVATextInput.props.value).toEqual('12345678901234567')
    })
  })

  describe('when user selects an account type', () => {
    it('should update the value of the accountType', async () => {
      const accountTypeRNPickerSelect = testInstance.findByType(RNPickerSelect)
      accountTypeRNPickerSelect.props.onValueChange('Checking')

      const accountTypePicker = testInstance.findByType(VAPicker)
      expect(accountTypePicker.props.selectedValue).toEqual('Checking')
    })
  })
})

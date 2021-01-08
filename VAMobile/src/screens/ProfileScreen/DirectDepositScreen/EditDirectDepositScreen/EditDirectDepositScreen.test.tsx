import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import EditDirectDepositScreen from './EditDirectDepositScreen'
import { InitialState, initialDirectDepositState } from 'store/reducers'
import {CheckBox, LoadingComponent, StyledTextInput, VAPicker, VATextInput} from 'components'
import RNPickerSelect  from 'react-native-picker-select'
import {StackNavigationOptions} from "@react-navigation/stack/lib/typescript/src/types";
import { updateBankInfo } from 'store/actions'

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    updateBankInfo: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})

context('EditDirectDepositScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let routingNumberTextInput: ReactTestInstance
  let accountNumberTextInput: ReactTestInstance
  let accountTypeRNPickerSelect: ReactTestInstance
  let confirmCheckBox: ReactTestInstance
  let navHeaderSpy: any

  const initializeTestInstance = (saving = false) => {
    store = mockStore({
      ...InitialState,
      directDeposit: {
        ...initialDirectDepositState,
        saving
      }
    })

    props = mockNavProps(
      {},
      {
        goBack: jest.fn(),
        navigate: jest.fn(),
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined
          }
        },
      }
    )

    act(() => {
      component = renderWithProviders(<EditDirectDepositScreen {...props} />, store)
    })

    testInstance = component.root
    routingNumberTextInput = testInstance.findAllByType(StyledTextInput)[0]
    accountNumberTextInput = testInstance.findAllByType(StyledTextInput)[1]
    if (!saving) {
      accountTypeRNPickerSelect = testInstance.findByType(RNPickerSelect)
      confirmCheckBox = testInstance.findByType(CheckBox)
    }
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when saving is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when user enters a routing number', () => {
    it('should update the value of routingNumber', async () => {
      routingNumberTextInput.props.onChangeText('123456789')

      const routingNumberVATextInput = testInstance.findAllByType(VATextInput)[0]
      expect(routingNumberVATextInput.props.value).toEqual('123456789')
    })
  })

  describe('when user enters an account number', () => {
    it('should update the value of accountNumber', async () => {
      accountNumberTextInput.props.onChangeText('12345678901234567')

      const accountNumberVATextInput = testInstance.findAllByType(VATextInput)[1]
      expect(accountNumberVATextInput.props.value).toEqual('12345678901234567')
    })
  })

  describe('when user selects an account type', () => {
    it('should update the value of the accountType', async () => {
      accountTypeRNPickerSelect.props.onValueChange('Checking')

      const accountTypePicker = testInstance.findByType(VAPicker)
      expect(accountTypePicker.props.selectedValue).toEqual('Checking')
    })
  })

  describe('when content is valid', () => {
    it('should set disable to false for confirm checkbox', async () => {
      expect(confirmCheckBox.props.disabled).toBeTruthy()

      act(() => {
        routingNumberTextInput.props.onChangeText('123456789')
        accountNumberTextInput.props.onChangeText('12345678901234567')
        accountTypeRNPickerSelect.props.onValueChange('Checking')
      })

      expect(confirmCheckBox.props.disabled).toBeFalsy()
    })

    it('should allow a user toggle confirm checkbox to true and set disabled to false for save', async () => {
      expect(confirmCheckBox.props.selected).toBeFalsy()
      expect(navHeaderSpy.save.props.disabled).toBeTruthy()

      act(() => {
        routingNumberTextInput.props.onChangeText('123456789')
        accountNumberTextInput.props.onChangeText('12345678901234567')
        accountTypeRNPickerSelect.props.onValueChange('Checking')
        confirmCheckBox.props.onSelectionChange(true)
      })

      expect(confirmCheckBox.props.selected).toBeTruthy()
      expect(navHeaderSpy.save.props.disabled).toBeFalsy()
    })

    it('should call updateBankInfo when save is pressed', async () => {
      act(() => {
        routingNumberTextInput.props.onChangeText('123456789')
        accountNumberTextInput.props.onChangeText('12345678901234567')
        accountTypeRNPickerSelect.props.onValueChange('Checking')
        confirmCheckBox.props.onSelectionChange(true)
      })

      navHeaderSpy.save.props.onSave()
      expect(updateBankInfo).toBeCalledWith('12345678901234567', '123456789', 'Checking')
    })
  })

  describe('when content is invalid', () => {
    it('should disable confirm checkbox, toggle off confirm checkbox, and disable save', async () => {
      act(() => {
        routingNumberTextInput.props.onChangeText('123456789')
        accountNumberTextInput.props.onChangeText('12345')
        accountTypeRNPickerSelect.props.onValueChange('Checking')
        confirmCheckBox.props.onSelectionChange(true)
      })

      expect(confirmCheckBox.props.disabled).toBeFalsy()
      expect(confirmCheckBox.props.selected).toBeTruthy()
      expect(navHeaderSpy.save.props.disabled).toBeFalsy()

      act(() => {
        routingNumberTextInput.props.onChangeText('12')
        accountNumberTextInput.props.onChangeText('')
      })

      expect(confirmCheckBox.props.disabled).toBeTruthy()
      expect(confirmCheckBox.props.selected).toBeFalsy()
      expect(navHeaderSpy.save.props.disabled).toBeTruthy()
    })
  })

  describe('when bankInfoUpdated is true', () => {
    it('should call navigations go back function', async () => {
      store = mockStore({
        ...InitialState,
        directDeposit: {
          ...InitialState.directDeposit,
          bankInfoUpdated: true
        }
      })

      act(() => {
        component = renderWithProviders(<EditDirectDepositScreen {...props} />, store)
      })
      testInstance = component.root

      expect(props.navigation.goBack).toBeCalled()
    })
  })
})

import 'react-native'
import React from 'react'
import { TextInput } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import EditDirectDepositScreen from './EditDirectDepositScreen'
import { InitialState, initialDirectDepositState, ErrorsState, initialErrorsState, initializeErrorsByScreenID } from 'store/reducers'
import { AlertBox, VASelector, ErrorComponent, LoadingComponent, VAModalPicker, VATextInput, TextView } from 'components'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { updateBankInfo } from 'store/actions'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    updateBankInfo: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
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

  const initializeTestInstance = (saving = false, errorsState: ErrorsState = initialErrorsState) => {
    store = mockStore({
      ...InitialState,
      directDeposit: {
        ...initialDirectDepositState,
        saving,
      },
      errors: errorsState,
    })

    props = mockNavProps(
      {},
      {
        goBack: jest.fn(),
        navigate: jest.fn(),
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined,
          }
        },
      },
    )

    act(() => {
      component = renderWithProviders(<EditDirectDepositScreen {...props} />, store)
    })

    testInstance = component.root
    routingNumberTextInput = testInstance.findAllByType(TextInput)[0]
    accountNumberTextInput = testInstance.findAllByType(TextInput)[1]

    if (!saving) {
      accountTypeRNPickerSelect = testInstance.findByType(VAModalPicker)
      confirmCheckBox = testInstance.findByType(VASelector)
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
      accountTypeRNPickerSelect.props.onSelectionChange('Checking')

      const accountTypePicker = testInstance.findByType(VAModalPicker)
      expect(accountTypePicker.props.selectedValue).toEqual('Checking')
    })
  })

  describe('when content is valid', () => {
    it('should call updateBankInfo when save is pressed', async () => {
      act(() => {
        routingNumberTextInput.props.onChangeText('123456789')
        accountNumberTextInput.props.onChangeText('12345678901234567')
        accountTypeRNPickerSelect.props.onSelectionChange('Checking')
        confirmCheckBox.props.onSelectionChange(true)

        navHeaderSpy.save.props.onSave()
      })

      expect(updateBankInfo).toBeCalledWith('12345678901234567', '123456789', 'Checking', ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID)
    })
  })

  describe('when content is invalid', () => {
    it('should display an AlertBox and field errors', async () => {
      act(() => {
        routingNumberTextInput.props.onChangeText('')
        accountNumberTextInput.props.onChangeText('')
        accountTypeRNPickerSelect.props.onSelectionChange('')
        confirmCheckBox.props.onSelectionChange(false)

        navHeaderSpy.save.props.onSave()
      })
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[7].props.children).toEqual("Enter the bank's 9-digit routing number.")
      expect(testInstance.findAllByType(TextView)[12].props.children).toEqual('Enter your account number.')
      expect(testInstance.findAllByType(TextView)[22].props.children).toEqual('Select the type that best describes the account.')
      expect(testInstance.findAllByType(TextView)[24].props.children).toEqual('Confirm this information is correct.')
    })
  })

  describe('when bankInfoUpdated is true', () => {
    it('should call navigations go back function', async () => {
      store = mockStore({
        ...InitialState,
        directDeposit: {
          ...InitialState.directDeposit,
          bankInfoUpdated: true,
        },
      })

      act(() => {
        component = renderWithProviders(<EditDirectDepositScreen {...props} />, store)
      })
      testInstance = component.root

      expect(props.navigation.goBack).toBeCalled()
    })
  })

  describe('when invalidRoutingNumberError is true', () => {
    it('should show alert box', async () => {
      store = mockStore({
        ...InitialState,
        directDeposit: {
          ...InitialState.directDeposit,
          bankInfoUpdated: true,
          invalidRoutingNumberError: true,
        },
      })

      act(() => {
        component = renderWithProviders(<EditDirectDepositScreen {...props} />, store)
      })
      testInstance = component.root

      expect(testInstance.findByType(AlertBox)).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(true, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(true, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})

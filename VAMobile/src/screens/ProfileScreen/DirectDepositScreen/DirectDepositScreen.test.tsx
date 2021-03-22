import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import { context, mockStore, renderWithProviders } from 'testUtils'

import { DirectDepositState, ErrorsState, initialAuthState, initialErrorsState } from 'store/reducers'
import { UserDataProfile } from 'store/api/types'
import DirectDepositScreen from './index'
import {ErrorComponent, LoadingComponent, TextView} from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

let mockNavigationSpy = jest.fn()
jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual("../../../utils/hooks")
  let theme = jest.requireActual("../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('DirectDepositScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (loading = false, errorsState: ErrorsState = initialErrorsState) => {
    const directDeposit: DirectDepositState = {
      loading,
      saving: false,
      paymentAccount: {
        accountNumber: '******1234',
        accountType: 'Savings',
        financialInstitutionName: 'BoA',
        financialInstitutionRoutingNumber: '12341234123',
      },
    }

    store = mockStore({
      auth: {...initialAuthState},
      directDeposit,
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<DirectDepositScreen />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when there is bank data', () => {
    it('should display the button with the given bank data', () => {
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Account')
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('BoA')
      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('******1234')
      expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('Savings account')
    })
  })

  describe('when there is no bank data', () => {
    it('should render the button with the text Add your bank account information', async () => {
      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { profile: {} as UserDataProfile, loading: false }
      })
      act(() => {
        component = renderWithProviders(<DirectDepositScreen />, store)
      })
      testInstance = component.root
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Add your bank account information')

      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: {
          profile: ({ bank_data: { bank_account_number: null, bank_account_type: null, bank_name: null } } as unknown) as UserDataProfile,
          loading: false
        }
      })
      act(() => {
        component = renderWithProviders(<DirectDepositScreen />, store)
      })
      testInstance = component.root
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Add your bank account information')
    })
  })

  describe('when no profile data', () => {
    it('should only render the button with the text Account', async () => {
      store = mockStore({
        auth: {...initialAuthState},
      })
      act(() => {
        component = renderWithProviders(<DirectDepositScreen />, store)
      })
      testInstance = component.root
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Account')
    })
  })

  describe('when bank info is clicked', () => {
    it('should call navigation navigate', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
      expect(mockNavigationSpy).toBeCalled()
      expect(mockNavigationSpy).toBeCalledWith('EditDirectDeposit')
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})

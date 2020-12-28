import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import { context, findByTestID, mockStore, renderWithProviders } from 'testUtils'

import { DirectDepositState } from '../../../store/reducers'
import { UserDataProfile } from 'store/api/types'
import DirectDepositScreen from './index'
import { PhoneData } from 'store/api/types/PhoneData'

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

  beforeEach(() => {
    const directDeposit: DirectDepositState = {
      loading: false,
      saving: false,
      paymentAccount: {
        accountNumber: '******1234',
        accountType: 'Savings',
        financialInstitutionName: 'BoA',
        financialInstitutionRoutingNumber: '12341234123',
      },
    }

    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false },
      directDeposit,
    })

    act(() => {
      component = renderWithProviders(<DirectDepositScreen />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when there is bank data', () => {
    it('should display the button with the given bank data', () => {
      expect(findByTestID(testInstance, 'Account-title').props.children).toEqual('Account')
      expect(findByTestID(testInstance, 'BoA-title').props.children).toEqual('BoA')
      expect(findByTestID(testInstance, '******1234-title').props.children).toEqual('******1234')
      expect(findByTestID(testInstance, 'Savings-title').props.children).toEqual('Savings')
    })
  })

  describe('when there is no bank data', () => {
    it('should render the button with the text Please add your bank account information', async () => {
      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile: {} as UserDataProfile, loading: false }
      })
      act(() => {
        component = renderWithProviders(<DirectDepositScreen />, store)
      })
      testInstance = component.root
      expect(findByTestID(testInstance, 'Please add your bank account information-title').props.children).toEqual('Please add your bank account information')

      store = mockStore({
        auth: {
          initializing: true,
          loggedIn: false,
          loading: false,
        },
        personalInformation: {
          profile: ({ bank_data: { bank_account_number: null, bank_account_type: null, bank_name: null } } as unknown) as UserDataProfile,
          loading: false
        }
      })
      act(() => {
        component = renderWithProviders(<DirectDepositScreen />, store)
      })
      testInstance = component.root
      expect(findByTestID(testInstance, 'Please add your bank account information-title').props.children).toEqual('Please add your bank account information')
    })
  })

  describe('when no profile data', () => {
    it('should only render the button with the text Account', async () => {
      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
      })
      act(() => {
        component = renderWithProviders(<DirectDepositScreen />, store)
      })
      testInstance = component.root
      expect(findByTestID(testInstance, 'Account-title').props.children).toEqual('Account')
    })
  })

  describe('when bank info is clicked', () => {
    it('should call navigation navigate', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
      expect(mockNavigationSpy).toBeCalled()
      expect(mockNavigationSpy).toBeCalledWith('EditDirectDeposit')
    })
  })
})

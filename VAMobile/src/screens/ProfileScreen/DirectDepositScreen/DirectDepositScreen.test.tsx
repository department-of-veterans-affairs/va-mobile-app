import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, findByTestID, mockStore, renderWithProviders } from 'testUtils'

import { DirectDepositState } from '../../../store/reducers'
import { UserDataProfile } from 'store/api/types'
import DirectDepositScreen from './index'
import { PhoneData } from 'store/api/types/PhoneData'

context('ProfileScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const profile: UserDataProfile = {
      first_name: 'Ben',
      middle_name: 'M',
      last_name: 'Morgan',
      full_name: 'Ben M Morgan',
      email: '',
      birth_date: '',
      gender: '',
      addresses: '',
      most_recent_branch: '',
      home_phone: {} as PhoneData,
      mobile_phone:  {} as PhoneData,
      work_phone:  {} as PhoneData,
      fax_number: ''
    }

    const directDeposit: DirectDepositState = {
      bankData: {
        bank_account_number: '1234',
        bank_account_type: 'Savings',
        bank_name: 'BoA',
      },
    }

    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false, profile },
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
        auth: { initializing: true, loggedIn: false, loading: false, profile: {} as UserDataProfile },
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
          profile: ({ bank_data: { bank_account_number: null, bank_account_type: null, bank_name: null } } as unknown) as UserDataProfile,
        },
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
})

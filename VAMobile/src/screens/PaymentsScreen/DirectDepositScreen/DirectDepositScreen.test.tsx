import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { DirectDepositState, ErrorsState, initialErrorsState, initializeErrorsByScreenID } from 'store/slices'
import { context, mockNavProps, render } from 'testUtils'

import DirectDepositScreen from './index'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('DirectDepositScreen', () => {
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
      bankInfoUpdated: false,
      invalidRoutingNumberError: false,
    }

    render(<DirectDepositScreen {...mockNavProps()} />, {
      preloadedState: {
        directDeposit,
        errors: errorsState,
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance(true)
      expect(screen.getByText('Loading your direct deposit information...')).toBeTruthy()
    })
  })

  describe('when there is bank data', () => {
    it('should display the button with the given bank data', () => {
      expect(screen.getByText('Account')).toBeTruthy()
      expect(screen.getByText('BoA')).toBeTruthy()
      expect(screen.getByText('******1234')).toBeTruthy()
      expect(screen.getByText('Savings account')).toBeTruthy()
    })
  })

  describe('when there is no bank data', () => {
    it('should render the button with the text Add your bank account information', () => {
      render(<DirectDepositScreen {...mockNavProps()} />)
      expect(screen.getByText('Add your bank account information')).toBeTruthy()
    })
  })

  describe('when bank info is clicked', () => {
    it('should call navigation navigate', () => {
      fireEvent.press(screen.getByTestId('account-boa-******1234-savings-account'))
      expect(mockNavigationSpy).toBeCalledWith('EditDirectDeposit', { displayTitle: 'Edit account' })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component', () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID] =
        CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      initializeTestInstance(false, errorState)
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })
})

import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, render, mockNavProps } from 'testUtils'
import {
  DirectDepositState,
  ErrorsState,
  initialAuthorizedServicesState,
  initialAuthState,
  initialErrorsState,
  initializeErrorsByScreenID,
  initialMilitaryServiceState,
  initialPersonalInformationState,
} from 'store/slices'
import { ServiceData, UserDataProfile } from 'store/api/types'
import DirectDepositScreen from './index'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const authorizedMilitaryState = {
  authorizedServices: {
    ...initialAuthorizedServicesState,
    militaryServiceHistory: true,
  },
  militaryService: {
    ...initialMilitaryServiceState,
    serviceHistory: [{} as ServiceData],
  },
}

context('DirectDepositScreen', () => {
  let mockNavigateToSpy: jest.Mock

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
    mockNavigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(mockNavigateToSpy)

    render(<DirectDepositScreen {...mockNavProps()} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        directDeposit,
        errors: errorsState,
        ...authorizedMilitaryState,
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(screen.getByText('Loading your direct deposit information...'))
    })
  })

  describe('when there is bank data', () => {
    it('should display the button with the given bank data', async () => {
      expect(screen.getByText('Account'))
      expect(screen.getByText('BoA'))
      expect(screen.getByText('******1234'))
      expect(screen.getByText('Savings account'))
    })
  })

  describe('when there is no bank data', () => {
    it('should render the button with the text Add your bank account information', async () => {
      render(<DirectDepositScreen {...mockNavProps()} />, {
        preloadedState: {
          auth: { ...initialAuthState },
          personalInformation: {
            ...initialPersonalInformationState,
            profile: {} as UserDataProfile,
            needsDataLoad: false,
          },
          ...authorizedMilitaryState,
        },
      })
      expect(screen.getByText('Add your bank account information'))
    })
  })

  describe('when bank info is clicked', () => {
    it('should call navigation navigate', async () => {
      fireEvent.press(screen.getByTestId('account-boa-******1234-savings-account'))
      expect(mockNavigationSpy).toBeCalledWith('EditDirectDeposit', { displayTitle: 'Edit account' })
      expect(mockNavigateToSpy).toHaveBeenCalled()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      initializeTestInstance(false, errorState)
      expect(screen.getByText("The app can't be loaded."))
    })
  })
})

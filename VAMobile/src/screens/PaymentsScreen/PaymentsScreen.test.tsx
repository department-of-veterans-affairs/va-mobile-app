import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, findByTestID, render, RenderAPI } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import {
  ErrorsState,
  initialAuthorizedServicesState,
  initialAuthState,
  initialErrorsState,

} from 'store/slices'
import { SigninServiceTypes, SigninServiceTypesConstants } from 'store/api/types'
import { waitFor } from '@testing-library/react-native'
import { when } from 'jest-when'
import PaymentsScreen from './index'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('PaymentsScreen', () => {
    let component: RenderAPI
    let testInstance: ReactTestInstance
    let navigateToDirectDepositSpy: jest.Mock
    let navigateToHowToUpdateDirectDepositSpy: jest.Mock
  
    const initializeTestInstance = (
      directDepositBenefits: boolean = false,
      directDepositBenefitsUpdate: boolean = false,
      errorState: ErrorsState = initialErrorsState,
      signinService: SigninServiceTypes = SigninServiceTypesConstants.IDME,
    ): void => {
      navigateToDirectDepositSpy = jest.fn()
      navigateToHowToUpdateDirectDepositSpy = jest.fn()
  
      when(mockNavigationSpy)
        .mockReturnValue(() => {})
        .calledWith('DirectDeposit')
        .mockReturnValue(navigateToDirectDepositSpy)
        .calledWith('HowToUpdateDirectDeposit')
        .mockReturnValue(navigateToHowToUpdateDirectDepositSpy)
  
      component = render(<PaymentsScreen />, {
        preloadedState: {
          auth: { ...initialAuthState },
          authorizedServices: {
            ...initialAuthorizedServicesState,
            directDepositBenefits,
            directDepositBenefitsUpdate,
          },
          errors: errorState,
        },
      })
  
      testInstance = component.container
    }
  

  describe('direct deposit', () => {
    describe('when directDepositBenefits is true', () => {
      it('should be shown', async () => {
        await waitFor(() => {
          initializeTestInstance(true)
        })
        expect(findByTestID(testInstance, 'direct-deposit-information')).toBeTruthy()
      })
    })

    describe('when user signs in through IDME ', () => {
      it('should navigate to DirectDeposit', async () => {
        await waitFor(() => {
          initializeTestInstance(true, true)
        })
        findByTestID(testInstance, 'direct-deposit-information').props.onPress()
        expect(navigateToDirectDepositSpy).toHaveBeenCalled()
      })
    })

    describe('when user signs in through Login.gov ', () => {
      it('should navigate to DirectDeposit', async () => {
        await waitFor(() => {
          initializeTestInstance(true, true, undefined, SigninServiceTypesConstants.LOGINGOV)
        })
        findByTestID(testInstance, 'direct-deposit-information').props.onPress()
        expect(navigateToDirectDepositSpy).toHaveBeenCalled()
      })
    })

    describe('when user did not signs in through IDME and does not have directDepositBenefits', () => {
      it('should navigate to HowToUpdateDirectDeposit', async () => {
        await waitFor(() => {
          initializeTestInstance(false, false, initialErrorsState, SigninServiceTypesConstants.MHV)
        })
        findByTestID(testInstance, 'direct-deposit-information').props.onPress()
        expect(navigateToHowToUpdateDirectDepositSpy).toHaveBeenCalled()
      })
    })
  })
})

import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { context, render } from 'testUtils'

import PaymentsScreen from './index'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('PaymentsScreen', () => {
  const initializeTestInstance = (authorized = true): void => {
    render(<PaymentsScreen />, {
      queriesData: [
        {
          queryKey: authorizedServicesKeys.authorizedServices,
          data: {
            appeals: true,
            appointments: true,
            claims: true,
            decisionLetters: true,
            directDepositBenefits: true,
            directDepositBenefitsUpdate: authorized,
            disabilityRating: true,
            genderIdentity: true,
            lettersAndDocuments: true,
            militaryServiceHistory: true,
            paymentHistory: true,
            preferredName: true,
            prescriptions: true,
            scheduleAppointments: true,
            secureMessaging: true,
            userProfileUpdate: true,
          },
        },
      ],
    })
  }

  describe('when user does not have directDepositBenefits', () => {
    it('should navigate to HowToUpdateDirectDeposit', () => {
      initializeTestInstance(false)
      fireEvent.press(screen.getByRole('link', { name: 'Direct deposit information' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('HowToUpdateDirectDeposit')
    })
  })

  describe('when user does have directDepositBenefits', () => {
    it('should navigate to DirectDeposit', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: 'Direct deposit information' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('DirectDeposit')
    })
  })

  describe('when user click on VA payment history', () => {
    it('should navigate to PaymentHistory', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: 'VA payment history' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('DirectDeposit')
    })
  })
})

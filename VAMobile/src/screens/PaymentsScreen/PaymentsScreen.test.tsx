import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

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

jest.mock('../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest
      .fn()
      .mockReturnValueOnce({
        status: 'success',
        data: {
          appeals: true,
          appointments: true,
          claims: true,
          decisionLetters: true,
          directDepositBenefits: true,
          directDepositBenefitsUpdate: false,
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
      })
      .mockReturnValue({
        status: 'success',
        data: {
          appeals: true,
          appointments: true,
          claims: true,
          decisionLetters: true,
          directDepositBenefits: true,
          directDepositBenefitsUpdate: true,
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
      }),
  }
})

context('PaymentsScreen', () => {
  const initializeTestInstance = (): void => {
    render(<PaymentsScreen />)
  }

  describe('when user does not have directDepositBenefits', () => {
    it('should navigate to HowToUpdateDirectDeposit', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('menuitem', { name: 'Direct deposit information' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('HowToUpdateDirectDeposit')
    })
  })

  describe('when user does have directDepositBenefits', () => {
    it('should navigate to DirectDeposit', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('menuitem', { name: 'Direct deposit information' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('DirectDeposit')
    })
  })

  describe('when user click on VA payment history', () => {
    it('should navigate to PaymentHistory', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('menuitem', { name: 'VA payment history' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('DirectDeposit')
    })
  })
})

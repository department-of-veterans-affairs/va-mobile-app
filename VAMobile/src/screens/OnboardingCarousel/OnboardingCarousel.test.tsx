import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { QueriesData, context, render } from 'testUtils'

import OnboardingCarousel from './OnboardingCarousel'

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
  }
})

context('OnboardingCarousel', () => {
  const renderWithData = (queriesData?: QueriesData) => {
    render(<OnboardingCarousel />, { queriesData })
  }

  beforeEach(() => {
    renderWithData([
      {
        queryKey: personalInformationKeys.personalInformation,
        data: {
          firstName: 'Gary',
          middleName: null,
          lastName: 'Washington',
          signinEmail: 'Gary.Washington@idme.com',
          signinService: 'IDME',
          fullName: 'Gary Washington',
          birthDate: null,
        },
      },
    ])
  })

  it('renders correctly through out each screen', () => {
    expect(screen.getByRole('header', { name: 'Welcome, Gary' })).toBeTruthy()
    expect(screen.getByText(t('onboarding.allInformationYouNeed'))).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: t('next') }))
    expect(screen.getByRole('header', { name: t('onboarding.health.header') })).toBeTruthy()
    expect(screen.getByText(t('onboarding.health.details'))).toBeTruthy()
    expect(screen.getByText(t('onboarding.health.details.prescriptions.bullet'))).toBeTruthy()
    expect(screen.getByText(t('onboarding.health.details.communicate.bullet'))).toBeTruthy()
    expect(screen.getByText(t('onboarding.health.details.appointments.bullet'))).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: t('next') }))
    expect(screen.getByRole('header', { name: t('onboarding.benefits.header') })).toBeTruthy()
    expect(screen.getByText(t('onboarding.benefits.details'))).toBeTruthy()
    expect(screen.getByText(t('onboarding.benefits.disability.bullet'))).toBeTruthy()
    expect(screen.getByText(t('onboarding.benefits.claimsAndAppeals.bullet'))).toBeTruthy()
    expect(screen.getByText(t('onboarding.benefits.commonLetters.bullet'))).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: t('next') }))
    expect(screen.getByRole('header', { name: t('onboarding.payments.header') })).toBeTruthy()
    expect(screen.getByText(t('onboarding.payments.details'))).toBeTruthy()
    expect(screen.getByText(t('onboarding.payments.directDeposit.bullet'))).toBeTruthy()
    expect(screen.getByText(t('onboarding.payments.paymentHistory.bullet'))).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: t('done') }))
    expect(completeFirstTimeLogin).toHaveBeenCalled()
  })

  describe('at the end of the carousel', () => {
    it('should call completeFirstTimeLogin when you skip', () => {
      fireEvent.press(screen.getByRole('link', { name: t('skip') }))
      expect(completeFirstTimeLogin).toHaveBeenCalled()
    })
  })
})

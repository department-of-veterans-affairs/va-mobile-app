import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { completeFirstTimeLogin } from 'store/slices'
import { QueriesData, context, render } from 'testUtils'

import OnboardingCarousel from './OnboardingCarousel'

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
  }
})

jest.mock('store/slices', () => {
  const actual = jest.requireActual('store/slices')
  return {
    ...actual,
    completeFirstTimeLogin: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
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

  it('renders correctly through out each screen and calls completeFirstTimeLogin once you get to the end', () => {
    expect(screen.getByRole('header', { name: 'Welcome, Gary' })).toBeTruthy()
    expect(
      screen.getByText(
        'With this app, you can manage your VA health care, benefits, and payments from your phone or tablet.',
      ),
    ).toBeTruthy()
    fireEvent.press(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('header', { name: 'Manage your health care' })).toBeTruthy()
    expect(screen.getByText('Use our health care tools to manage tasks like these:')).toBeTruthy()
    expect(screen.getByText('Refill your prescriptions')).toBeTruthy()
    expect(screen.getByText('Communicate with your health care team')).toBeTruthy()
    expect(screen.getByText('Review your appointments')).toBeTruthy()
    fireEvent.press(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('header', { name: 'Manage your benefits' })).toBeTruthy()
    expect(screen.getByText('Use our benefits tools to manage tasks like these:')).toBeTruthy()
    expect(screen.getByText('Review your disability rating')).toBeTruthy()
    expect(screen.getByText('Check the status of your claims and appeals')).toBeTruthy()
    expect(screen.getByText('Download common VA letters')).toBeTruthy()
    fireEvent.press(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('header', { name: 'Manage your payments' })).toBeTruthy()
    expect(screen.getByText('Use our payments tools to manage tasks like these:')).toBeTruthy()
    expect(screen.getByText('Update your direct deposit information')).toBeTruthy()
    expect(screen.getByText('Review the history of payments we’ve sent to you')).toBeTruthy()
    fireEvent.press(screen.getByRole('button', { name: 'Done' }))
    expect(completeFirstTimeLogin).toHaveBeenCalled()
  })

  describe('at the end of the carousel', () => {
    it('should call completeFirstTimeLogin when you skip', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Skip' }))
      expect(completeFirstTimeLogin).toHaveBeenCalled()
    })
  })
})

import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { QueriesData, context, render } from 'testUtils'
import OnboardingCarousel from './OnboardingCarousel'
import { completeFirstTimeLogin } from 'store/slices'
import { personalInformationKeys } from 'api/personalInformation/queryKeys'

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
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
    renderWithData([{
      queryKey: personalInformationKeys.personalInformation,
      data: {
        firstName: 'Gary',
        middleName: null,
        lastName: 'Washington',
        signinEmail: 'Gary.Washington@idme.com',
        signinService: 'IDME',
        fullName: 'Gary Washington',
        birthDate: null
      }
    }])
  })

  it('renders correctly through out each screen and calls completeFirstTimeLogin once you get to the end', async () => {
    expect(screen.getByText('Welcome, Gary')).toBeTruthy()
    expect(screen.getByText('With this app, you can manage your VA health care, benefits, and payments from your phone or tablet.')).toBeTruthy()
    fireEvent.press(screen.getByText('Next'))
    expect(screen.getByText('Manage your health care')).toBeTruthy()
    expect(screen.getByText('Use our health care tools to manage tasks like these:')).toBeTruthy()
    expect(screen.getByText('Refill your prescriptions')).toBeTruthy()
    expect(screen.getByText('Communicate with your health care team')).toBeTruthy()
    expect(screen.getByText('Review your appointments')).toBeTruthy()
    fireEvent.press(screen.getByText('Next'))
    expect(screen.getByText('Manage your benefits')).toBeTruthy()
    expect(screen.getByText('Use our benefits tools to manage tasks like these:')).toBeTruthy()
    expect(screen.getByText('Review your disability rating')).toBeTruthy()
    expect(screen.getByText('Check the status of your claims and appeals')).toBeTruthy()
    expect(screen.getByText('Download common VA letters')).toBeTruthy()
    fireEvent.press(screen.getByText('Next'))
    expect(screen.getByText('Manage your payments')).toBeTruthy()
    expect(screen.getByText('Use our payments tools to manage tasks like these:')).toBeTruthy()
    expect(screen.getByText('Update your direct deposit information')).toBeTruthy()
    expect(screen.getByText('Review the history of payments we’ve sent to you')).toBeTruthy()
    fireEvent.press(screen.getByText('Done'))
    expect(completeFirstTimeLogin).toHaveBeenCalled()
  })

  describe('at the end of the carousel', () => {
    it('should call completeFirstTimeLogin when you skip', async () => {
      fireEvent.press(screen.getByText('Skip'))
      expect(completeFirstTimeLogin).toHaveBeenCalled()
    })
  })
})

import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import OnboardingCarousel from './OnboardingCarousel'
import { EmailData, PhoneData } from 'store/api/types'
import { completeFirstTimeLogin, InitialState } from 'store/slices'

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
  beforeEach(() => {
    render(<OnboardingCarousel />, {
      preloadedState: {
        ...InitialState,
        personalInformation: {
          ...InitialState.personalInformation,
          profile: {
            middleName: '',
            lastName: '',
            genderIdentity: null,
            contactEmail: {} as EmailData,
            signinEmail: '',
            birthDate: '',
            addresses: '',
            homePhoneNumber: {} as PhoneData,
            mobilePhoneNumber: {} as PhoneData,
            workPhoneNumber: {} as PhoneData,
            fullName: '',
            firstName: 'Billy',
            signinService: 'IDME',
          },
        },
      },
    })
  })

  it('renders correctly through out each screen and calls completeFirstTimeLogin once you get to the end', async () => {
    expect(screen.getByText('Welcome, Billy')).toBeTruthy()
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

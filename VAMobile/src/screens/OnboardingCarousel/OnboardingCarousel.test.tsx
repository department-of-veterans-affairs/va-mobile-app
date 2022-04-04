import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import { context, mockStore, render, RenderAPI } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import OnboardingCarousel from './OnboardingCarousel'
import { EmailData, PhoneData } from 'store/api/types'
import { completeFirstTimeLogin, InitialState } from 'store/slices'
import { Carousel } from 'components'

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
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<OnboardingCarousel />, {
      preloadedState: {
        ...InitialState,
        personalInformation: {
          ...InitialState.personalInformation,
          profile: {
            middleName: '',
            lastName: '',
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

    testInstance = component.container
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('at the end of the carousel', () => {
    it('should call completeFirstTimeLogin', async () => {
      testInstance.findByType(Carousel).props.onCarouselEnd()
      expect(completeFirstTimeLogin).toHaveBeenCalled()
    })
  })
})

import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import OnboardingAppOverview from './OnboardingAppOverview'
import {InitialState} from 'store/reducers'
import {TextView} from 'components'

context('OnboardingAppOverview', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (firstName: string = 'Bill') => {
    store = mockStore({
      ...InitialState,
      personalInformation: {
        ...InitialState.personalInformation,
        profile: {
          ...InitialState.personalInformation.profile,
          firstName
        }
      }
    })

    act(() => {
      component = renderWithProviders(<OnboardingAppOverview />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when there is a first name available', () => {
    it('should display "Welcome to VA Mobile, Name" as the header', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Welcome to VA Mobile, Bill')
    })
  })

  describe('when there is not a first name available', () => {
    it('should display "Welcome to VA Mobile" as the header', async () => {
      initializeTestInstance('')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Welcome to VA Mobile')
    })
  })
})

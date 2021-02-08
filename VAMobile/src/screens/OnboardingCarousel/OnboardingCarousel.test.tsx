import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import OnboardingCarousel from './OnboardingCarousel'
import {InitialState} from 'store/reducers'

context('OnboardingCarousel', () => {
  let component: any
  let store: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    store = mockStore({
      ...InitialState,
      personalInformation: {
        ...InitialState.personalInformation,
        profile: {
          ...InitialState.personalInformation.profile,
          firstName: 'Billy'
        }
      }
    })

    act(() => {
      component = renderWithProviders(<OnboardingCarousel />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

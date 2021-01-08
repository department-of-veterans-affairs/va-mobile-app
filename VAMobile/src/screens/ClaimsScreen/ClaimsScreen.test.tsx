import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { TestProviders, context, mockStore } from 'testUtils'
import renderer, { act } from 'react-test-renderer'

import { ClaimsAndAppealsState, initialClaimsAndAppealsState } from 'store/reducers'
import ClaimsScreen from './ClaimsScreen'
import {LoadingComponent} from 'components';

context('ClaimsScreen', () => {
  let store: any
  let component: any
  let testInstance: any

  const initializeTestInstance = (loading = false) => {
    const claimsAndAppeals: ClaimsAndAppealsState = {
      ...initialClaimsAndAppealsState,
      loading
    }

    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false },
      claimsAndAppeals
    })

    act(() => {
      component = renderer.create(
        <TestProviders store={store}>
          <ClaimsScreen />
        </TestProviders>,
      )
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

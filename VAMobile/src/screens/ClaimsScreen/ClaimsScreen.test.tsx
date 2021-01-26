import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import {ClaimsAndAppealsState, initialClaimsAndAppealsState, InitialState} from 'store/reducers'
import ClaimsScreen from './ClaimsScreen'
import {AlertBox, LoadingComponent, TextView} from 'components'

context('ClaimsScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (loading = false, claimsServiceError = false) => {
    const claimsAndAppeals: ClaimsAndAppealsState = {
      ...initialClaimsAndAppealsState,
      loadingAllClaimsAndAppeals: loading,
      claimsServiceError
    }

    store = mockStore({
      ...InitialState,
      claimsAndAppeals
    })

    act(() => {
      component = renderWithProviders(<ClaimsScreen/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when loadingAllClaimsAndAppeals is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when claimsServiceError exists', () => {
    it('should display an alertbox', async () => {
      initializeTestInstance(false, true)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Claims status is unavailable')
    })
  })
})

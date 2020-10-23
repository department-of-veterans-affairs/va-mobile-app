import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { Linking } from 'react-native'
import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import HowDoIUpdateScreen from './HowDoIUpdateScreen'

context('HowDoIUpdateScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })

    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false },
    })

    act(() => {
      component = renderWithProviders(<HowDoIUpdateScreen {...props} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the find VA location link is clicked', () => {
    it('should call Linkings openUrl with the parameter https://www.va.gov/find-locations/', async () => {
      findByTestID(testInstance, 'find-your-nearest-va-location').props.onPress()
      expect(Linking.openURL).toHaveBeenCalledWith('https://www.va.gov/find-locations/')
    })
  })
})

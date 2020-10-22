import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import PersonalInformationScreen from './index'

context('PersonalInformationScreen', () => {
  let store: any
  let component: any

  beforeEach(() => {
    const props = mockNavProps()

    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false },
    })

    act(() => {
      component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

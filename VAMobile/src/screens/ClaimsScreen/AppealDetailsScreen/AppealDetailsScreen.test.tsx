import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import AppealDetailsScreen from './AppealDetailsScreen'
import { InitialState } from 'store/reducers'
import { appeal } from '../appealData'

context('AppealDetailsScreen', () => {
  let component: any
  let props: any
  let store: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (): void => {
    props = mockNavProps(undefined, undefined, { params: {appealID: '0'} })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: { loading: false, appeal }
    })

    act(() => {
      component = renderWithProviders(<AppealDetailsScreen {...props} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })
})

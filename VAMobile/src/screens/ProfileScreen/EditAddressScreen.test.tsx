import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import EditAddressScreen from './EditAddressScreen'
import { InitialState } from 'store/reducers'

context('EditAddressScreen', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    props = mockNavProps(
      {},
      {
        setOptions: jest.fn()
      },
      {
        params: {
          displayTitle: 'Mailing Address',
          addressType: 'mailing_address'
        }
      }
    )

    store = mockStore({
      ...InitialState
    })

    act(() => {
      component = renderWithProviders(<EditAddressScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import {InitialState} from 'store/reducers'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import UploadFailure from './UploadFailure'

context('UploadFailure', () => {
  let component: any
  let testInstance: any
  let props: any
  let store: any

  const initializeTestInstance = () => {
    props = mockNavProps(undefined, { setOptions: jest.fn() })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        claim: Claim
      }
    })

    act(() => {
      component = renderWithProviders(<UploadFailure {...props}/>, store)
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

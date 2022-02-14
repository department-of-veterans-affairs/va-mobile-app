import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { act } from 'react-test-renderer'

import { InitialState } from 'store/slices'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import UploadFailure from './UploadFailure'

context('UploadFailure', () => {
  let component: RenderAPI
  let testInstance: any
  let props: any

  const initializeTestInstance = () => {
    props = mockNavProps(undefined, { setOptions: jest.fn() })

    component = render(<UploadFailure {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claim: Claim,
        },
      },
    })

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

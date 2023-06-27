import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import Mock = jest.Mock
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import NetworkConnectionError from './NetworkConnectionError'

context('NetworkConnectionError', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onTryAgainPressSpy: Mock

  beforeEach(() => {
    component = render(<NetworkConnectionError onTryAgain={onTryAgainPressSpy} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

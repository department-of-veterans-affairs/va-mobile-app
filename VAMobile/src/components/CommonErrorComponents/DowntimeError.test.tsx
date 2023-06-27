import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

import { context, render, RenderAPI } from 'testUtils'
import DowntimeError from './DowntimeError'
import Mock = jest.Mock

context('DowntimeError', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onTryAgainSpy: Mock

  beforeEach(() => {
    component = render(<DowntimeError screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

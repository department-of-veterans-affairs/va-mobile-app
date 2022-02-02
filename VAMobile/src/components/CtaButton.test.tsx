import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import Mock = jest.Mock

import { context, render, RenderAPI } from 'testUtils'
import CtaButton from './CtaButton'

context('CtaButton', () => {
  let component: RenderAPI
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    component = render(<CtaButton />)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

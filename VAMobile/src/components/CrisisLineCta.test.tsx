import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import Mock = jest.Mock

import { context, render } from 'testUtils'
import CrisisLineCta from './CrisisLineCta'
import { RenderAPI } from '@testing-library/react-native'

context('CrisisLineCta', () => {
  let component: RenderAPI
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    component = render(<CrisisLineCta onPress={onPressSpy} />)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, renderWithProviders } from 'testUtils'
import CrisisLineCta from './CrisisLineCta'

context('CrisisLineCta', () => {
  let component: any
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    act(() => {
      component = renderWithProviders(<CrisisLineCta onPress={onPressSpy} />)
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

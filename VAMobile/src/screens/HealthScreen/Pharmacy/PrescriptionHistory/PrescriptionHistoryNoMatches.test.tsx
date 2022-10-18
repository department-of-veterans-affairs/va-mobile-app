import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import PrescriptionHistoryNoMatches from './PrescriptionHistoryNoMatches'
import { PrescriptionHistoryTabConstants } from 'store/api'

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

context('PrescriptionHistoryNoMatches', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<PrescriptionHistoryNoMatches currentTab={PrescriptionHistoryTabConstants.ALL} />)

    testInstance = component.container
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

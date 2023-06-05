import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import PrescriptionHistoryNoPrescriptions from './PrescriptionHistoryNoPrescriptions'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('PrescriptionHistoryNoPrescriptions', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<PrescriptionHistoryNoPrescriptions />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

import 'react-native'
import React from 'react'
import {act, ReactTestInstance} from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import HowToUpdateDirectDepositScreen from './HowToUpdateDirectDepositScreen'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

context('HowToUpdateDirectDepositScreen', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<HowToUpdateDirectDepositScreen />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})

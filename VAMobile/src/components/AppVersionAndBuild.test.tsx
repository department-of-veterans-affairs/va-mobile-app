import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, findByTypeWithSubstring, renderWithProviders } from 'testUtils'
import TextView from './TextView'
import AppVersionAndBuild from './AppVersionAndBuild'

jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

context('AppVersionAndBuild', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<AppVersionAndBuild {...props} />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should display the Version: text', async () => {
    expect(findByTypeWithSubstring(testInstance, TextView, 'Version:')).toBeTruthy()
  })
})

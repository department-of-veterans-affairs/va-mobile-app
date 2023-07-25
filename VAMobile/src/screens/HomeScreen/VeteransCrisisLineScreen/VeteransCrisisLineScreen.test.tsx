import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, findByTestID, render, RenderAPI } from 'testUtils'
import VeteransCrisisLineScreen from './VeteransCrisisLineScreen'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('VeteransCrisisLineScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<VeteransCrisisLineScreen />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
  
  describe('when the veteransCrisisLine.net link is clicked', () => {
    it('should launch external link with the parameter https://www.veteranscrisisline.net/', async () => {
      act(() => {
        testInstance.findByProps({ accessibilityLabel: 'Veterans Crisis Line .net' }).props.onPress()
      })
      expect(mockExternalLinkSpy).toBeCalledWith('https://www.veteranscrisisline.net/')
    })
  })
})

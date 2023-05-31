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

  describe('when the call number and press 1 link is clicked', () => {
    it('should launch external link with the parameter tel:8002738255', async () => {
      act(() => {
        testInstance.findByProps({ accessibilityLabel: 'Call 800-273-8255 and select 1' }).props.onPress()
      })
      expect(mockExternalLinkSpy).toBeCalledWith('tel:8002738255')
    })
  })

  describe('when the text 838255 link is clicked', () => {
    it('should launch external link with the parameter sms:838255', async () => {
      act(() => {
        testInstance.findByProps({ accessibilityLabel: 'text 8 3 8 2 5 5' }).props.onPress()
      })
      expect(mockExternalLinkSpy).toBeCalledWith('sms:838255')
    })
  })

  describe('when the start confidential chat link is clicked', () => {
    it('should launch external link with the parameter https://www.veteranscrisisline.net/get-help/chat', async () => {
      act(() => {
        testInstance.findByProps({ accessibilityLabel: 'Start a confidential chat' }).props.onPress()
      })
      expect(mockExternalLinkSpy).toBeCalledWith('https://www.veteranscrisisline.net/get-help/chat')
    })
  })
  describe('when the 800-799-4889 link is clicked', () => {
    it('should launch external link with the parameter tel:8007994889', async () => {
      act(() => {
        testInstance.findByProps({ accessibilityLabel: '800-799-4889' }).props.onPress()
      })
      expect(mockExternalLinkSpy).toBeCalledWith('tel:8007994889')
    })
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

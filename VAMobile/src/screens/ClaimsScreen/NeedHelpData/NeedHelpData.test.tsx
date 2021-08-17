import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import NeedHelpData from './NeedHelpData'
import {TouchableWithoutFeedback} from 'react-native'

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

context('NeedHelpData', () => {
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (isAppeal?: boolean) => {
    act(() => {
      component = renderWithProviders(<NeedHelpData isAppeal={isAppeal}/>)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should launch external link on click of the number', async () => {
    testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
    expect(mockExternalLinkSpy).toHaveBeenCalled()
  })

  describe('when isAppeal is true', () => {
    it('should launch external link on click of the url', async () => {
      initializeTestInstance(true)
      testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
      expect(mockExternalLinkSpy).toHaveBeenCalled()
    })
  })
})

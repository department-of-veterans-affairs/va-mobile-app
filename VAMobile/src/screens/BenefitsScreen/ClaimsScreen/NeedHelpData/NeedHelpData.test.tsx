import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, render, RenderAPI } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import NeedHelpData from './NeedHelpData'
import { TouchableWithoutFeedback } from 'react-native'
import { waitFor } from '@testing-library/react-native'
import * as hooks from 'utils/hooks'

const mockExternalLinkSpy = jest.fn()

context('NeedHelpData', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = async (isAppeal?: boolean) => {
    await waitFor(() => {
      component = render(<NeedHelpData isAppeal={isAppeal} />)
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(async () => {
    jest.spyOn(hooks, 'useExternalLink').mockReturnValue((url) => mockExternalLinkSpy(url))
    await initializeTestInstance()
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
      await initializeTestInstance(true)
      testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
      expect(mockExternalLinkSpy).toHaveBeenCalled()
    })
  })
})

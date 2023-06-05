import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import { VAButton } from 'components'
import ReplyMessageButton from './ReplyMessageButton'
import { waitFor } from '@testing-library/react-native'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('ReplyMessageButton', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let navigateToSpy: jest.Mock

  beforeEach(() => {
    navigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(navigateToSpy)
    component = render(<ReplyMessageButton messageID={1} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the footer button', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByType(VAButton).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalledWith('ReplyMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {}, messageID: 1 })
      expect(navigateToSpy).toHaveBeenCalled()
    })
  })
})

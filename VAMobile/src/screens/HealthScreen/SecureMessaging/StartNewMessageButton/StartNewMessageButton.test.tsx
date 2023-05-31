import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import StartNewMessageButton from './StartNewMessageButton'
import { VAButton } from 'components'
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

context('StartNewMessageFooter', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let mockNavigateToSpy: jest.Mock

  beforeEach(() => {
    mockNavigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(mockNavigateToSpy)
    component = render(<StartNewMessageButton />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the footer button', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => {
        testInstance.findByType(VAButton).props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalledWith('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
        expect(mockNavigateToSpy).toHaveBeenCalled()
      })
    })
  })
})

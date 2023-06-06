import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import BasicError from './BasicError'
import Mock = jest.Mock
import { Pressable } from 'react-native'

context('BasicError', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onTryAgainSpy: Mock
  beforeEach(async () => {
    onTryAgainSpy = jest.fn(() => {})

    await waitFor(() => {
      component = render(<BasicError onTryAgain={onTryAgainSpy} messageText={'message body'} />)
    })

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the try again button is clicked', () => {
    it('should call the onTryAgain function', async () => {
      await waitFor(() => {
        testInstance.findByType(Pressable).props.onPress()
      })
      expect(onTryAgainSpy).toBeCalled()
    })
  })
})

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import Mock = jest.Mock

import { context, findByTestID, render, RenderAPI, waitFor } from 'testUtils'
import TextArea from './TextArea'

context('TextArea', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock
  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    component = render(<TextArea onPress={onPressSpy} />)
    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when onPress exists', () => {
    it('should contain a TouchableWithoutFeedback', async () => {
      expect(testInstance.findByType(TouchableWithoutFeedback)).toBeTruthy()
    })

    it('should call onPress on press', async () => {
      await waitFor(() => {
        testInstance.findByType(TextArea).props.onPress()
        expect(onPressSpy).toBeCalled()
      })
    })
  })

  describe('when onPress does not exist', () => {
    it('should not render a TouchableWithoutFeedback', async () => {
      component = render(<TextArea />)
      testInstance = component.UNSAFE_root
      expect(testInstance.findAllByType(TouchableWithoutFeedback).length).toEqual(0)
    })
  })
})

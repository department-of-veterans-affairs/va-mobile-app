import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import TextArea from './TextArea'
import TextView from './TextView'

import Mock = jest.Mock

context('TextArea', () => {
  let onPressSpy: Mock
  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    render(
      <TextArea onPress={onPressSpy}>
        <TextView>test text</TextView>
      </TextArea>,
    )
  })

  describe('when onPress exists', () => {
    it('should call onPress on press', () => {
      fireEvent.press(screen.getByText(/test text/))
      expect(onPressSpy).toBeCalled()
    })
  })

  describe('when onPress does not exist', () => {
    it('should not render a TouchableWithoutFeedback', () => {
      render(
        <TextArea>
          <TextView>test text</TextView>
        </TextArea>,
      )
      fireEvent.press(screen.getByText(/test text/))
      expect(onPressSpy).not.toBeCalled()
    })
  })
})

import React from 'react'
import Mock = jest.Mock
import { context, render, screen, fireEvent } from 'testUtils'
import TextArea from './TextArea'

context('TextArea', () => {
  let onPressSpy: Mock
  beforeEach(() => {
    onPressSpy = jest.fn(() => { })
    render(<TextArea onPress={onPressSpy} />)
  })

  describe('when onPress exists', () => {
    it('should call onPress on press', async () => {
      fireEvent.press(screen.UNSAFE_getByType(TextArea))
      expect(onPressSpy).toBeCalled()
    })
  })

  describe('when onPress does not exist', () => {
    it('should not render a TouchableWithoutFeedback', async () => {
      render(<TextArea />)
      fireEvent.press(screen.UNSAFE_getByType(TextArea))
      expect(onPressSpy).not.toBeCalled()
    })
  })
})

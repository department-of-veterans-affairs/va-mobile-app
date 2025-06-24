import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { MenuItem } from 'components/Menu/MenuItem'
import { context, render } from 'testUtils'

context('MenuItem', () => {
  describe('Pressable', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn()
      render(<MenuItem onPress={onPress} />)

      const view = screen.getByRole('button')
      fireEvent.press(view)
      expect(onPress).toHaveBeenCalled()
    })
    it('should not call onPress when disabled', () => {
      const onPress = jest.fn()
      render(<MenuItem onPress={onPress} disabled />)

      const view = screen.getByRole('button')
      fireEvent.press(view)
      expect(onPress).not.toHaveBeenCalled()
    })
  })
})

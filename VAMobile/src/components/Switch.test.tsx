import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import Switch from './Switch'

context('Switch', () => {
  let onPressSpy = jest.fn(() => {})

  beforeEach(() => {
    render(<Switch onPress={onPressSpy} a11yHint="Test switch" />)
  })

  describe('when the switch is clicked', () => {
    it('calls the onPress function', async () => {
      fireEvent.press(screen.getByA11yHint('Test switch'))
      expect(onPressSpy).toBeCalled()
    })
  })
})

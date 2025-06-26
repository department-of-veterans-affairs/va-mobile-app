import React from 'react'
import { Dimensions, View } from 'react-native'
import { ScaledSize } from 'react-native/Libraries/Utilities/Dimensions'

import { act, fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import MenuView from 'components/Menu/MenuView'
import { context, render } from 'testUtils'

const defaultScreenSize = {
  width: 500,
  height: 500,
  scale: 0,
  fontScale: 0,
}

context('Menu', () => {
  const actionText = ' actionText'
  const initializeTestInstance = async (screenSize: ScaledSize = defaultScreenSize) => {
    Dimensions.get = jest.fn().mockReturnValue(screenSize)
    const actions = [
      {
        actionText,
        addDivider: true,
        onPress: jest.fn(),
      },
    ]
    render(<MenuView actions={actions} />)

    // Menu should be hidden
    expect(screen.queryByText(actionText)).toBeNull()

    // Click on button to open menu
    const moreIcon = screen.getByText(t('more'))
    await act(() => {
      fireEvent.press(moreIcon)
    })

    // Menu should be visible with action items
    await waitFor(() => expect(screen.queryByText(actionText)).not.toBeNull())
  }

  describe('MenuView', () => {
    beforeEach(() => {
      View.prototype.measureInWindow = jest.fn().mockImplementation((f) => {
        f(0, 0, 100, 100)
      })
      initializeTestInstance()
    })

    it('should hide menu when dimensions change', async () => {
      // Change the dimensions
      Dimensions.set({ screen: { width: 600, height: 500 }, window: { width: 600, height: 500 } })

      // The menu should automatically hide itself
      await waitFor(() => expect(screen.queryByText(actionText)).toBeNull())
    })

    it('should hide menu on action press', async () => {
      // Press the action button
      const action = screen.getByText(actionText)
      fireEvent.press(action)

      // The menu should close on action press
      await waitFor(() => expect(screen.queryByText(actionText)).toBeNull())
    })
  })
  describe('Menu', () => {
    beforeEach(() => {
      View.prototype.measureInWindow = jest.fn().mockImplementation((f) => {
        f(0, 0, 100, 100)
      })
      initializeTestInstance()
    })

    it('should be visible after layout change', async () => {
      // Manually trigger layout change
      const view = screen.getByTestId('menu-modal-content')
      view.props.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: 100, height: 100 } } })

      await waitFor(() => expect(screen.getByText(actionText)).not.toBeNull())
    })

    it('should hide menu on Close Menu button press', async () => {
      await initializeTestInstance({ width: 0, height: 0, fontScale: 0, scale: 0 })

      const view = screen.getByTestId('menu-modal-content')
      view.props.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: -6, height: -6 } } })

      // Press close menu button
      const closeMenuButton = screen.getByTestId('menu-modal-close-button')
      fireEvent.press(closeMenuButton)

      await waitFor(() => expect(screen.queryByText(actionText)).toBeNull())
    })
  })
})

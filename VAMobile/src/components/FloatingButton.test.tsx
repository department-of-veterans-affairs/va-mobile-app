import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render, waitFor } from 'testUtils'

import FloatingButton from './FloatingButton'

context('FloatingButton', () => {
  const onPressSpy = jest.fn()

  const initializeTestInstance = (isHidden: boolean = false) => {
    render(
      <FloatingButton
        isHidden={isHidden}
        label="My Button Label"
        a11yLabel="My a11y Button Label"
        onPress={onPressSpy}
      />,
    )
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('renders label', () => {
    expect(screen.getByRole('button', { name: 'My Button Label' })).toBeTruthy()
    expect(screen.getByLabelText('My a11y Button Label')).toBeTruthy()
  })

  it('calls onPress when clicked', () => {
    fireEvent.press(screen.getByRole('button', { name: 'My Button Label' }))
    expect(onPressSpy).toHaveBeenCalled()
  })

  describe('When isHidden is set to true', () => {
    it('should not display the floating button', async () => {
      initializeTestInstance(true)
      await waitFor(() => expect(screen.queryByRole('button', { name: 'My Button Label' })).toBeFalsy())
    })
  })
})

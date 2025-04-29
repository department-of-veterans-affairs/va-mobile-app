import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import PhotoAdd from './PhotoAdd'

context('PhotoAdd', () => {
  const onPressSpy = jest.fn()

  beforeEach(() => {
    render(<PhotoAdd width={110} height={110} onPress={onPressSpy} imagesEmptyError={false} />)
  })

  it('renders a11yHint', () => {
    expect(screen.getByA11yHint('Add a photo to your file')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Add photo' }))
    expect(onPressSpy).toHaveBeenCalled()
  })
})

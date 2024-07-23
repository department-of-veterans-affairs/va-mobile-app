import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import LargeNavButton from './LargeNavButton'

context('LargeNavButton', () => {
  const onPressSpy = jest.fn()

  beforeEach(() => {
    render(<LargeNavButton title={'My Title'} subText={'My Subtext'} a11yHint={'a11y'} onPress={onPressSpy} />)
  })

  it('renders title and subtext', () => {
    expect(screen.getByRole('link', { name: 'My Title' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'My Subtext' })).toBeTruthy()
  })

  it('calls onPress when clicked', () => {
    fireEvent.press(screen.getByRole('link', { name: 'My Title' }))
    expect(onPressSpy).toHaveBeenCalled()
  })
})

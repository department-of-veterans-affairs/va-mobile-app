import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import LargeNavButton from './LargeNavButton'

context('LargeNavButton', () => {
  const onPressSpy = jest.fn()

  beforeEach(() => {
    render(<LargeNavButton title={'My Title'} subText={'My Subtext'} tagCount={45} a11yHint={'a11y'} onPress={onPressSpy} />)
  })

  it('renders title, tagcount, and subtext', () => {
    expect(screen.getByRole('menuitem', { name: 'My Title' })).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: '45' })).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: 'My Subtext' })).toBeTruthy()
  })

  it('renders a11yHint and a11yLabel', () => {
    expect(screen.getByA11yHint('a11y')).toBeTruthy()
    expect(screen.getByLabelText('My Title  My Subtext')).toBeTruthy()
  })

  it('calls onPress when clicked', () => {
    fireEvent.press(screen.getByRole('menuitem', { name: 'My Title' }))
    expect(onPressSpy).toHaveBeenCalled()
  })
})

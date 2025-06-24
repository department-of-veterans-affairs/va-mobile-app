import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { CollapsibleView, TextView } from 'components'
import { context, render } from 'testUtils'

context('CollapsibleView', () => {
  beforeEach(() => {
    render(<CollapsibleView text={'Press here'} children={<TextView>Revealed text</TextView>} />)
  })

  it('renders text', () => {
    expect(screen.getByRole('tab', { name: 'Press here' })).toBeTruthy()
  })

  it('shows/hides children on press', () => {
    fireEvent.press(screen.getByRole('tab', { name: 'Press here' }))
    expect(screen.getByRole('tab', { expanded: true })).toBeTruthy()
    expect(screen.getByText('Revealed text')).toBeTruthy()

    fireEvent.press(screen.getByRole('tab', { name: 'Press here' }))
    expect(screen.getByRole('tab', { expanded: false })).toBeTruthy()
    expect(screen.queryByText('Revealed text')).toBeFalsy()
  })
})

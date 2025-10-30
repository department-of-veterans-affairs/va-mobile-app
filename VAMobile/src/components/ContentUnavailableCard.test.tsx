import React from 'react'

import ContentUnavailableCard from 'components/ContentUnavailableCard'
import { context, render, screen } from 'testUtils'

context('ContentUnavailableCard', () => {
  it('should render the text provided', () => {
    render(<ContentUnavailableCard textId="contentUnavailable" />)
    expect(
      screen.getByText('This content isn’t available while offline. Check your connection and try again.'),
    ).toBeTruthy()
  })
})

import React from 'react'
import { context, render, screen } from 'testUtils'
import MessagesCountTag from './MessagesCountTag'

context('MessagesCountTag', () => {

  beforeEach(() => {
    render(<MessagesCountTag unread={2} />)
  })

  it('should render unread as 2', () => {
    expect(screen.getByText('2')).toBeTruthy()
  })
})

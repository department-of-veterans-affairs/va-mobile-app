import React from 'react'

import { context, render, screen } from 'testUtils'

import HeaderTitle from './HeaderTitle'

context('HeaderTitle', () => {
  beforeEach(() => {
    render(<HeaderTitle headerTitle="Test Title" accessible={true} accessabilityLabel="header title" />)
  })

  it('should render the title provided', () => {
    expect(screen.getByText(/Test Title/)).toBeTruthy()
  })

  it('should render accessibility labels and roles', () => {
    expect(screen.getByRole('header', { name: 'Test Title' })).toBeTruthy()
    expect(screen.getByLabelText('header title')).toBeTruthy()
  })
})

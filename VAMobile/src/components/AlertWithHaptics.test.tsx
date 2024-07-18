import React from 'react'

import { context, render, screen } from 'testUtils'

import AlertWithHaptics from './AlertWithHaptics'

context('AlertWithHaptics', () => {
  beforeEach(() => {
    render(<AlertWithHaptics variant="warning" header={'Warning title'} description={'My warning'} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('My warning')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Warning title' })).toBeTruthy()
  })
})

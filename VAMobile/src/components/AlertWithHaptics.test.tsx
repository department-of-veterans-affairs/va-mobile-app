import React from 'react'

import AlertWithHaptics from 'components/AlertWithHaptics'
import { context, render, screen } from 'testUtils'

context('AlertWithHaptics', () => {
  beforeEach(() => {
    render(<AlertWithHaptics variant="warning" header={'Warning title'} description={'My warning'} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('My warning')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Warning title' })).toBeTruthy()
  })
})

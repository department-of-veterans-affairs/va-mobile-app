import React from 'react'

import AppVersionAndBuild from 'components/AppVersionAndBuild'
import { context, render, screen } from 'testUtils'

context('AppVersionAndBuild', () => {
  beforeEach(() => {
    render(<AppVersionAndBuild />)
  })

  it('should display the Version: text', () => {
    expect(screen.getByText(/Version:/)).toBeTruthy()
  })
})

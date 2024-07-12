import React from 'react'

import { context, render, screen } from 'testUtils'

import AppVersionAndBuild from './AppVersionAndBuild'

context('AppVersionAndBuild', () => {
  beforeEach(() => {
    render(<AppVersionAndBuild />)
  })

  it('should display the Version: text', () => {
    expect(screen.getByText(/Version:/)).toBeTruthy()
  })
})

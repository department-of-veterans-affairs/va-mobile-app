import React from 'react'
import { context, screen, render } from 'testUtils'
import AppVersionAndBuild from './AppVersionAndBuild'

context('AppVersionAndBuild', () => {

  beforeEach(() => {
    render(<AppVersionAndBuild />)
  })

  it('should display the Version: text', () => {
    expect(screen.getByText(/Version:/)).toBeTruthy()
  })
})

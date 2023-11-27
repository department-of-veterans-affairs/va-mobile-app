import React from 'react'
import { context, screen, render } from 'testUtils'
import AppVersionAndBuild from './AppVersionAndBuild'

context('AppVersionAndBuild', () => {
  let props: any

  beforeEach(() => {
    render(<AppVersionAndBuild {...props} />)
  })

  it('should display the Version: text', async () => {
    expect(screen.getByText(/Version:/)).toBeTruthy()
  })
})

import React from 'react'

import { context, render, screen } from 'testUtils'

import AlertWithScroll from './AlertWithScroll'

context('AlertWithScroll', () => {
  beforeEach(() => {
    render(<AlertWithScroll variant="warning" header={'Warning title'} description={'My warning'} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('My warning')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Warning title' })).toBeTruthy()
  })
})

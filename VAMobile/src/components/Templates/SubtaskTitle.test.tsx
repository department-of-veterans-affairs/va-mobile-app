import React from 'react'

import { context, render, screen } from 'testUtils'

import SubtaskTitle from './SubtaskTitle'

context('SubtaskTitle', () => {
  beforeEach(() => {
    render(<SubtaskTitle title="Hello" a11yLabel="The label" />)
  })

  it('renders title and a11yLabel', () => {
    expect(screen.getByText('Hello')).toBeTruthy()
    expect(screen.getByLabelText('The label')).toBeTruthy()
  })
})

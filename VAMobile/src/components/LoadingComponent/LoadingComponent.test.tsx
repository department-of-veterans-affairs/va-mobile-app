import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import LoadingComponent from './LoadingComponent'

context('LoadingComponent', () => {
  beforeEach(() => {
    render(<LoadingComponent text={'This is a loading component'} a11yLabel="This is the label" />)
  })

  it('renders text', () => {
    expect(screen.getByText('This is a loading component')).toBeTruthy()
  })

  it('renders a11yLabel', () => {
    expect(screen.getByLabelText('This is the label')).toBeTruthy()
  })
})

import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'

context('PrescriptionsDetailsBanner', () => {
  it('initializes correctly', () => {
    render(<PrescriptionsDetailsBanner />)
    expect(screen.getByText("We can't refill this prescription in the app")).toBeTruthy()
  })
})

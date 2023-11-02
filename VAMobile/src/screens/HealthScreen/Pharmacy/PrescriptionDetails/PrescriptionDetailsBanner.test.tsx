import React from 'react'
import { screen } from '@testing-library/react-native'

import { render, context } from 'testUtils'
import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'

context('PrescriptionsDetailsBanner', () => {
  const initializeTestInstance = () => {
    render(<PrescriptionsDetailsBanner />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText("We can't refill this prescription in the app")).toBeTruthy()
  })
})

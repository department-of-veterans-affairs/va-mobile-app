import 'react-native'
import React from 'react'

import { render, context } from 'testUtils'
import { screen } from '@testing-library/react-native'
import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'

context('PrescriptionsDetailsBanner', () => {
  const initializeTestInstance = () => {
    render(<PrescriptionsDetailsBanner />)
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(screen.getByText("We can't refill this prescription in the app")).toBeTruthy()
  })
})

import 'react-native'
import React from 'react'

import { context, render, screen } from 'testUtils'
import AlertBox from './AlertBox'

context('AlertBox', () => {
  beforeEach(() => {
    render(<AlertBox border="warning" text={'My warning'} title={'Warning title'} />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('My warning')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Warning title' })).toBeTruthy()
  })
})

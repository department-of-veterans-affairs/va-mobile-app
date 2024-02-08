import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoAppointments from './NoAppointments'

context('NoAppointments', () => {
  it('initializes correctly', () => {
    render(<NoAppointments subText="You don't have any appointments in this range" />)
    expect(screen.getByText('You don’t have any appointments')).toBeTruthy()
    expect(screen.getByText("You don't have any appointments in this range")).toBeTruthy()
    expect(screen.getByText('Visit VA.gov')).toBeTruthy()
  })
})

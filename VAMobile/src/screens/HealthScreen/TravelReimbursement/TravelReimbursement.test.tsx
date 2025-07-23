import React from 'react'

import { screen } from '@testing-library/react-native'

import { TravelReimbursement } from 'screens/HealthScreen/TravelReimbursement/TravelReimbursement'
import { context, mockNavProps, render } from 'testUtils'

context('TravelReimbursement', () => {
  const initializeTestInstance = () => {
    render(<TravelReimbursement {...mockNavProps()} />)
  }

  it('should show travel reimbursement header', () => {
    initializeTestInstance()
    expect(screen.getByLabelText('Travel Reimbursement')).toBeTruthy()
  })

  it('should have the correct testID', () => {
    initializeTestInstance()
    expect(screen.getByTestId('travelReimbursementTestID')).toBeTruthy()
  })
})

import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { TravelListReimbursement } from 'screens/HealthScreen/TravelListReimbursement/TravelListReimbursement'
import { context, mockNavProps, render } from 'testUtils'

context('TravelListReimbursement', () => {
  const initializeTestInstance = () => {
    render(<TravelListReimbursement {...mockNavProps()} />)
  }

  it('should show travel reimbursement header', () => {
    initializeTestInstance()
    expect(screen.getByLabelText(t('travelPay.statusList.reimbursement.title'))).toBeTruthy()
  })
})

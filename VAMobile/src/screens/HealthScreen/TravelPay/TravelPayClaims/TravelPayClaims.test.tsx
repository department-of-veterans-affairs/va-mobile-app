import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { TravelPayClaims } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaims'
import { context, mockNavProps, render } from 'testUtils'

context('TravelPayClaims', () => {
  const initializeTestInstance = () => {
    render(<TravelPayClaims {...mockNavProps()} />)
  }

  it('should show travel claims header', () => {
    initializeTestInstance()
    expect(screen.getByLabelText(t('travelPay.statusList.title'))).toBeTruthy()
  })
})

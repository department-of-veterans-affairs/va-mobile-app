import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import PrescriptionsDetailsBanner from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionsDetailsBanner'
import { context, render } from 'testUtils'

context('PrescriptionsDetailsBanner', () => {
  it('initializes correctly', () => {
    render(<PrescriptionsDetailsBanner />)
    expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
  })

  it('should show expanded content', () => {
    render(<PrescriptionsDetailsBanner />)
    fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
    expect(screen.getByText(`${t('prescription.details.banner.body')}`)).toBeTruthy()
  })
})

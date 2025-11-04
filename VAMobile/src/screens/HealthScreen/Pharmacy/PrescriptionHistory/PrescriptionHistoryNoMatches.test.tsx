import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import PrescriptionHistoryNoMatches from 'screens/HealthScreen/Pharmacy/PrescriptionHistory/PrescriptionHistoryNoMatches'
import { context, render } from 'testUtils'

context('PrescriptionHistoryNoMatches', () => {
  it('should show tab based content with no filter', () => {
    render(<PrescriptionHistoryNoMatches isFiltered={false} />)
    expect(screen.getAllByText(t('prescription.history.empty.message'))).toBeTruthy()
  })

  it('should show tab based content for filtered lists', () => {
    render(<PrescriptionHistoryNoMatches isFiltered={true} />)
    expect(screen.getAllByText(t('prescription.history.empty.filtered.message'))).toBeTruthy()
  })
})

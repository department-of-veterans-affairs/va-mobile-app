import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import PrescriptionHistoryNoMatches from './PrescriptionHistoryNoMatches'

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

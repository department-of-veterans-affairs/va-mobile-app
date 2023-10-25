import 'react-native'
import React from 'react'

import { screen } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import PrescriptionHistoryNoMatches from './PrescriptionHistoryNoMatches'
import { PrescriptionHistoryTabConstants } from 'store/api/types'

context('PrescriptionHistoryNoMatches', () => {
  it('should show tab based content with no filter', async () => {
    render(<PrescriptionHistoryNoMatches currentTab={PrescriptionHistoryTabConstants.PENDING} isFiltered={false} />)
    expect(screen.getAllByText('This list will only show refills requests you’ve submitted or refills that the VA pharmacy is processing.')).toBeTruthy()
  })

  it('should show tab based content for filtered lists', async () => {
    render(<PrescriptionHistoryNoMatches currentTab={PrescriptionHistoryTabConstants.TRACKING} isFiltered={true} />)
    expect(screen.getAllByText('We can’t find any refills with tracking information that match your filter selection. Try changing or resetting the filter.')).toBeTruthy()
  })
})

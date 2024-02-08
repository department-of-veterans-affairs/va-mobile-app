import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import PrescriptionHistoryNoMatches from './PrescriptionHistoryNoMatches'

context('PrescriptionHistoryNoMatches', () => {
  it('should show tab based content with no filter', () => {
    render(<PrescriptionHistoryNoMatches isFiltered={false} />)
    expect(
      screen.getAllByText('We can’t find any VA prescriptions that match the criteria for this list.'),
    ).toBeTruthy()
  })

  it('should show tab based content for filtered lists', () => {
    render(<PrescriptionHistoryNoMatches isFiltered={true} />)
    expect(
      screen.getAllByText(
        'We can’t find any VA prescriptions that match your filter selection. Try changing or resetting the filter.',
      ),
    ).toBeTruthy()
  })
})

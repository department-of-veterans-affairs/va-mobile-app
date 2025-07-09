import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import ConsolidatedClaimsNote from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ConsolidatedClaimsNote/ConsolidatedClaimsNote'
import { context, mockNavProps, render } from 'testUtils'

context('ConsolidatedClaimsNote', () => {
  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })
    render(<ConsolidatedClaimsNote {...props} />)
    jest.advanceTimersByTime(50)
  })

  it('Renders ConsolidatedClaimsNote', () => {
    expect(screen.getByRole('header', { name: t('claimDetails.whyWeCombinePanel') })).toBeTruthy()
    expect(screen.getByText(t('claimDetails.consolidatedClaims.noteContent'))).toBeTruthy()
  })
})

import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import ConsolidatedClaimsNote from './ConsolidatedClaimsNote'

context('ConsolidatedClaimsNote', () => {
  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })
    render(<ConsolidatedClaimsNote {...props} />)
  })

  it('Renders ConsolidatedClaimsNote', () => {
    expect(screen.getByRole('header', { name: t('claimDetails.whyWeCombinePanel') })).toBeTruthy()
    expect(screen.getByText(t('claimDetails.consolidatedClaims.noteContent'))).toBeTruthy()
  })
})

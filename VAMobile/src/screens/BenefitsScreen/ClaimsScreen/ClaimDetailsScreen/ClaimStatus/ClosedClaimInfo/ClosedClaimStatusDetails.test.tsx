import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import { claim } from '../../../claimData'
import ClosedClaimStatusDetails from './ClosedClaimStatusDetails'

context('ClosedClaimStatusDetails', () => {
  beforeEach(() => {
    render(<ClosedClaimStatusDetails claim={claim} claimType="CLOSED" letterIsDownloadable={true} />)
  })

  it('renders step header', () => {
    expect(screen.getByRole('header', { name: 'Step 8 of 8: Claim decided' })).toBeTruthy()
  })
})

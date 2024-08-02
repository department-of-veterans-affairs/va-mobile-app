import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import { claim } from '../../../claimData'
import ClosedClaimStatusDetails from './ClosedClaimStatusDetails'

const renderWithProps = (letterIsDownloadable = true) => {
  render(<ClosedClaimStatusDetails claim={claim} claimType="CLOSED" letterIsDownloadable={letterIsDownloadable} />)
}

context('ClosedClaimStatusDetails', () => {
  it('renders headers', () => {
    renderWithProps()
    expect(screen.getByRole('header', { name: 'Step 8 of 8: Claim decided' })).toBeTruthy()
    expect(screen.getByRole('header', { name: "What you've claimed" })).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Payments' })).toBeTruthy()
  })

  it('renders text for downloadable letter', () => {
    renderWithProps()
    expect(
      screen.getByText(
        'We decided your claim on January 31, 2019. You can download your decision letter. We also mailed you this letter.',
      ),
    ).toBeTruthy()
  })

  it('renders text for mailed letter', () => {
    renderWithProps(false)
    expect(
      screen.getByText(
        'We decided your claim on January 31, 2019. We mailed you a decision letter. It should arrive within 10 days after the date we decided your claim. It can sometimes take longer.',
      ),
    ).toBeTruthy()
  })

  it('renders list of claimed items', () => {
    renderWithProps()
    expect(screen.getByLabelText('Hearing Loss (Increase)')).toBeTruthy()
    expect(screen.getByLabelText('Ankle strain (related to: PTSD - Combat POW) (New)')).toBeTruthy()
    expect(screen.getByLabelText('Diabetes mellitus2 (Secondary)')).toBeTruthy()
  })
})

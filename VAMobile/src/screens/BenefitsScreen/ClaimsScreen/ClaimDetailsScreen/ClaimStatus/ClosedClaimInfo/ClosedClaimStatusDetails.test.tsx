import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import { claim } from '../../../claimData'
import ClosedClaimStatusDetails from './ClosedClaimStatusDetails'

const renderWithProps = (letterIsDownloadable = true) => {
  render(<ClosedClaimStatusDetails claim={claim} claimType="CLOSED" letterIsDownloadable={letterIsDownloadable} />)
}

context('ClosedClaimStatusDetails', () => {
  it('renders headers', () => {
    renderWithProps()
    expect(screen.getByRole('header', { name: t('claimDetails.step8of8') })).toBeTruthy()
    expect(screen.getByRole('header', { name: t('claimDetails.whatYouHaveClaimed') })).toBeTruthy()
    expect(screen.getByRole('header', { name: t('payments.title') })).toBeTruthy()
  })

  it('renders text for downloadable letter', () => {
    renderWithProps()
    expect(screen.getByText(t('claimDetails.weDecidedDownload', { date: 'January 31, 2019' }))).toBeTruthy()
  })

  it('renders text for mailed letter', () => {
    renderWithProps(false)
    expect(screen.getByText(t('claimDetails.weDecidedMailed', { date: 'January 31, 2019' }))).toBeTruthy()
  })

  it('renders list of claimed items', () => {
    renderWithProps()
    expect(screen.getByText('Hearing Loss (Increase)')).toBeTruthy()
    expect(screen.getByText('Ankle strain (related to: PTSD - Combat POW) (New)')).toBeTruthy()
    expect(screen.getByText('Diabetes mellitus2 (Secondary)')).toBeTruthy()
  })
})

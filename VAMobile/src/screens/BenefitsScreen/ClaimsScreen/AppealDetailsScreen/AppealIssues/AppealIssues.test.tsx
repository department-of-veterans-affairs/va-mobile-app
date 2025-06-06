import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppealIssue } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'

import AppealIssues from './AppealIssues'

context('AppealIssues', () => {
  beforeEach(() => {
    const issues: AppealIssue[] = [
      {
        active: true,
        description: 'Appeal is still under review',
        diagnosticCode: null,
        lastAction: null,
        date: null,
      },
      {
        active: true,
        description: 'Service connection, Post-traumatic stress disorder remand',
        diagnosticCode: null,
        lastAction: 'remand',
        date: null,
      },
      {
        active: true,
        description: 'Service connection for neck strain cavc_remand',
        diagnosticCode: null,
        lastAction: 'cavc_remand',
        date: null,
      },
      {
        active: true,
        description: 'Eligibility for loan guaranty benefits has filed grant',
        diagnosticCode: null,
        lastAction: 'field_grant',
        date: null,
      },
      {
        active: true,
        description: 'Eligibility for hearing lost allowed',
        diagnosticCode: null,
        lastAction: 'allowed',
        date: null,
      },
      {
        active: true,
        description: 'Service connection for tinnitus is denied',
        diagnosticCode: null,
        lastAction: 'denied',
        date: null,
      },
      {
        active: true,
        description: 'Eligibility for loan guaranty benefits withdrawn',
        diagnosticCode: null,
        lastAction: 'withdrawn',
        date: null,
      },
    ]
    render(<AppealIssues issues={issues} {...mockNavProps()} />)
  })

  it('should initialize', () => {
    // Currently on appeal
    expect(screen.getByRole('header', { name: t('appealDetails.currentlyOnAppeal') })).toBeTruthy()
    // under consideration
    expect(screen.getByRole('header', { name: t('appealDetails.underConsideration') })).toBeTruthy()
    expect(screen.getByText('Appeal is still under review')).toBeTruthy()
    // remand
    expect(screen.getByRole('header', { name: t('appealDetails.remand') })).toBeTruthy()
    expect(screen.getByText('Service connection, Post-traumatic stress disorder remand')).toBeTruthy()
    expect(screen.getByText('Service connection for neck strain cavc_remand')).toBeTruthy()

    // Closed
    expect(screen.getByRole('header', { name: t('appealDetails.closed') })).toBeTruthy()
    // granted
    expect(screen.getByRole('header', { name: t('appealDetails.granted') })).toBeTruthy()
    expect(screen.getByText('Eligibility for loan guaranty benefits has filed grant')).toBeTruthy()
    expect(screen.getByText('Eligibility for hearing lost allowed')).toBeTruthy()
    // denied
    expect(screen.getByRole('header', { name: t('appealDetails.denied') })).toBeTruthy()
    expect(screen.getByText('Service connection for tinnitus is denied')).toBeTruthy()
    // withdrawn
    expect(screen.getByRole('header', { name: t('appealDetails.withdrawnText') })).toBeTruthy()
    expect(screen.getByText('Eligibility for loan guaranty benefits withdrawn')).toBeTruthy()
  })
})

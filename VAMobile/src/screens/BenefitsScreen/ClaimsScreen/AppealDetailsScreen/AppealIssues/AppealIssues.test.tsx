import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppealIssue } from 'api/types'
import AppealIssues from 'screens/BenefitsScreen/ClaimsScreen/AppealDetailsScreen/AppealIssues/AppealIssues'
import { context, mockNavProps, render } from 'testUtils'

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
        lastAction: 'withdrawn',
        date: null,
      },
      {
        active: true,
        description: 'Eligibility for loan guaranty benefits withdrawn',
        diagnosticCode: null,
        lastAction: 'withdrawn',
        date: null,
      },
      // Issues with null descriptions
      {
        active: true,
        description: null,
        diagnosticCode: null,
        lastAction: null,
        date: null,
      },
      {
        active: true,
        description: null,
        diagnosticCode: null,
        lastAction: null,
        date: null,
      },
      // Granted (lastAction: field_grant, allowed)
      {
        active: true,
        description: null,
        diagnosticCode: null,
        lastAction: 'field_grant',
        date: null,
      },
      {
        active: true,
        description: null,
        diagnosticCode: null,
        lastAction: 'allowed',
        date: null,
      },
      // Remand (lastAction: remand, cavc_remand)
      {
        active: true,
        description: null,
        diagnosticCode: null,
        lastAction: 'remand',
        date: null,
      },
      // Denied (lastAction: denied)
      {
        active: true,
        description: null,
        diagnosticCode: null,
        lastAction: 'denied',
        date: null,
      },
      // Withdrawn (lastAction: withdrawn)
      {
        active: true,
        description: null,
        diagnosticCode: null,
        lastAction: 'withdrawn',
        date: null,
      },
    ]
    render(<AppealIssues appealType="appeal" issues={issues} {...mockNavProps()} />)
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

    // Test that the correct number of null description messages are rendered
    // Under consideration: 2 null issues, Granted: 2 null issues = 2 total "2 issues" messages
    // Remand: 2 null issues, Denied: 1 null issue, Withdrawn: 1 null issue = 3 total "1 issue" messages
    expect(screen.getAllByText(t("We're unable to show 2 issues on appeal"))).toHaveLength(2)
    expect(screen.getAllByText(t("We're unable to show 1 issue on appeal"))).toHaveLength(3)
  })

  it('should handle supplemental claim appeal type', () => {
    const issues: AppealIssue[] = [
      {
        active: true,
        description: null,
        diagnosticCode: null,
        lastAction: null,
        date: null,
      },
    ]

    render(<AppealIssues appealType="supplementalClaim" issues={issues} {...mockNavProps()} />)

    expect(screen.getByText(t("We're unable to show 1 issue on your Supplemental Claim"))).toBeTruthy()
  })

  it('should handle higher level review appeal type', () => {
    const issues: AppealIssue[] = [
      {
        active: true,
        description: null,
        diagnosticCode: null,
        lastAction: null,
        date: null,
      },
    ]

    render(<AppealIssues appealType="higherLevelReview" issues={issues} {...mockNavProps()} />)

    expect(screen.getByText(t("We're unable to show 1 issue on your Higher-Level Review"))).toBeTruthy()
  })
})

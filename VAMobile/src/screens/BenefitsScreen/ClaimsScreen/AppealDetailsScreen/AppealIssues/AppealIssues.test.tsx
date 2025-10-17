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
      // Issues with "We're unable..." descriptions from backend
      {
        active: true,
        description: "We're unable to show this issue on appeal",
        diagnosticCode: null,
        lastAction: null,
        date: null,
      },
      {
        active: true,
        description: "We're unable to show this issue on appeal",
        diagnosticCode: null,
        lastAction: null,
        date: null,
      },
      // Granted (lastAction: field_grant, allowed)
      {
        active: true,
        description: "We're unable to show this issue on your Higher-Level Review",
        diagnosticCode: null,
        lastAction: 'field_grant',
        date: null,
      },
      {
        active: true,
        description: "We're unable to show this issue on your Higher-Level Review",
        diagnosticCode: null,
        lastAction: 'allowed',
        date: null,
      },
      // Remand (lastAction: remand, cavc_remand)
      {
        active: true,
        description: "We're unable to show this issue on appeal",
        diagnosticCode: null,
        lastAction: 'remand',
        date: null,
      },
      // Denied (lastAction: denied)
      {
        active: true,
        description: "We're unable to show this issue on your Supplemental Claim",
        diagnosticCode: null,
        lastAction: 'denied',
        date: null,
      },
      // Withdrawn (lastAction: withdrawn)
      {
        active: true,
        description: "We're unable to show this issue on your Supplemental Claim",
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

    // Test that the frontend aggregates "We're unable..." issues correctly
    // Under consideration: 2 "unable" issues -> "2 issues" message
    // Granted: 2 "unable" issues (field_grant + allowed) -> "2 issues" message
    // Remand: 1 "unable" issue -> "1 issue" message
    // Denied: 1 "unable" issue -> "1 issue" message
    // Withdrawn: 1 "unable" issue -> "1 issue" message
    expect(
      screen.getAllByText(
        t('appealDetails.unableToShowIssues', {
          count: 2,
          appealType: 'appeal',
        }),
      ),
    ).toHaveLength(2)
    expect(
      screen.getAllByText(
        t('appealDetails.unableToShowIssue', {
          count: 1,
          appealType: 'appeal',
        }),
      ),
    ).toHaveLength(3)
  })

  it('should handle supplemental claim appeal type', () => {
    const issues: AppealIssue[] = [
      {
        active: true,
        description: "We're unable to show this issue on your Supplemental Claim",
        diagnosticCode: null,
        lastAction: null,
        date: null,
      },
    ]

    render(<AppealIssues appealType="supplementalClaim" issues={issues} {...mockNavProps()} />)

    expect(
      screen.getByText(
        t('appealDetails.unableToShowIssue', {
          count: 1,
          appealType: 'your Supplemental Claim',
        }),
      ),
    ).toBeTruthy()
  })

  it('should handle higher level review appeal type', () => {
    const issues: AppealIssue[] = [
      {
        active: true,
        description: "We're unable to show this issue on your Higher-Level Review",
        diagnosticCode: null,
        lastAction: null,
        date: null,
      },
    ]

    render(<AppealIssues appealType="higherLevelReview" issues={issues} {...mockNavProps()} />)

    expect(
      screen.getByText(
        t('appealDetails.unableToShowIssue', {
          count: 1,
          appealType: 'your Higher-Level Review',
        }),
      ),
    ).toBeTruthy()
  })
})

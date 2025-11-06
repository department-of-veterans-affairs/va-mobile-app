import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppealIssue, AppealIssueLastActionTypes, AppealTypesConstants } from 'api/types'
import AppealIssues from 'screens/BenefitsScreen/ClaimsScreen/AppealDetailsScreen/AppealIssues/AppealIssues'
import { context, mockNavProps, render } from 'testUtils'

context('AppealIssues', () => {
  const issue = (description: string, lastAction: AppealIssueLastActionTypes) => ({
    active: true,
    description: description,
    diagnosticCode: null,
    lastAction: lastAction,
    date: null,
  })

  const issues: AppealIssue[] = [
    issue('Appeal is still under review', null),
    issue('Service connection, Post-traumatic stress disorder remand', 'remand'),
    issue('Service connection for neck strain cavc_remand', 'cavc_remand'),
    issue('Eligibility for loan guaranty benefits has filed grant', 'field_grant'),
    issue('Eligibility for hearing lost allowed', 'allowed'),
    issue('Service connection for tinnitus is denied', 'withdrawn'),
    issue('Eligibility for loan guaranty benefits withdrawn', 'withdrawn'),
    // Issues with "We're unable..." descriptions from backend
    issue("We're unable to show this issue on appeal", null),
    issue("We're unable to show this issue on appeal", null),
    issue("We're unable to show this issue on your Higher-Level Review", 'field_grant'),
    issue("We're unable to show this issue on your Higher-Level Review", 'allowed'),
    issue("We're unable to show this issue on appeal", 'remand'),
    issue("We're unable to show this issue on your Supplemental Claim", 'denied'),
    issue("We're unable to show this issue on your Supplemental Claim", 'withdrawn'),
  ]

  it('should initialize', () => {
    render(<AppealIssues appealType={AppealTypesConstants.appeal} issues={issues} {...mockNavProps()} />)
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
    const supplementalClaimIssues: AppealIssue[] = [
      issue("We're unable to show this issue on your Supplemental Claim", null),
    ]

    render(<AppealIssues appealType="supplementalClaim" issues={supplementalClaimIssues} {...mockNavProps()} />)

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
    const higherLevelReviewIssues: AppealIssue[] = [
      issue("We're unable to show this issue on your Higher-Level Review", null),
    ]

    render(<AppealIssues appealType="higherLevelReview" issues={higherLevelReviewIssues} {...mockNavProps()} />)

    expect(
      screen.getByText(
        t('appealDetails.unableToShowIssue', {
          count: 1,
          appealType: 'your Higher-Level Review',
        }),
      ),
    ).toBeTruthy()
  })

  describe('Appeal explanation accordion', () => {
    it("should display the accordion when appealType is 'appeal' or 'legacyAppeal'", () => {
      render(<AppealIssues appealType={AppealTypesConstants.appeal} issues={issues} {...mockNavProps()} />)

      expect(screen.getByRole('header', { name: t('appealDetails.issuesDifferentHeader') })).toBeTruthy()
    })

    it("should NOT display the accordion when appealType is anything other than 'appeal' or 'legacyAppeal'", () => {
      render(<AppealIssues appealType={AppealTypesConstants.higherLevelReview} issues={issues} {...mockNavProps()} />)

      expect(screen.queryByRole('header', { name: t('appealDetails.issuesDifferentHeader') })).toBeFalsy()
    })
  })
})

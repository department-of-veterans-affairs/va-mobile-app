import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import AppealIssues from './AppealIssues'

context('AppealIssues', () => {
  beforeEach(() => {
    const issues = [
      'Service connection, Post-traumatic stress disorder',
      'Eligibility for loan guaranty benefits',
      'Service connected',
    ]
    render(<AppealIssues issues={issues} {...mockNavProps()} />)
  })

  it('should initialize', () => {
    expect(screen.getByRole('header', { name: t('appealDetails.currentlyOnAppeal') })).toBeTruthy()
    expect(screen.getByText('Service connection, Post-traumatic stress disorder')).toBeTruthy()
    expect(screen.getByText('Eligibility for loan guaranty benefits')).toBeTruthy()
    expect(screen.getByText('Service connected')).toBeTruthy()
  })
})

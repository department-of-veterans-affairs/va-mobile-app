import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import LoginScreen from 'screens/auth/LoginScreen'
import { context, render } from 'testUtils'

context('LoginScreen', () => {
  beforeEach(() => {
    render(<LoginScreen />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('button', { name: t('signin') })).toBeTruthy()
    expect(screen.getByRole('button', { name: t('findLocation.title') })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('loginIssues.reportLoginIssue') })).toBeTruthy()
    expect(screen.getByTestId('AppVersionTestID')).toBeTruthy()
  })
})

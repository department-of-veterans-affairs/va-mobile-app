import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import LoginIssues from 'screens/auth/LoginIssues'
import { context, render } from 'testUtils'

const mockGoBackSpy = jest.fn()

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useNavigation: () => ({
      setOptions: jest.fn(),
      goBack: mockGoBackSpy,
    }),
  }
})

context('LoginIssues', () => {
  beforeEach(() => {
    render(<LoginIssues />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('loginIssues.reportIssue'))).toBeTruthy()
  })

  it('submits and navigates correctly', async () => {
    fireEvent.press(screen.getByText(t('submit')))
    await waitFor(() => expect(mockGoBackSpy).toHaveBeenCalled())
  })
})

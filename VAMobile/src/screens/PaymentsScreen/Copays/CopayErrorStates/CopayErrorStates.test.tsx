import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import CopayErrorStates from 'screens/PaymentsScreen/Copays/CopayErrorStates/CopayErrorStates'
import { APIError } from 'store/api'
import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('utils/analytics', () => ({
  logAnalyticsEvent: jest.fn(),
}))

context('CopayErrorStates', () => {
  const initializeTestInstance = (copaysError: APIError) => {
    render(<CopayErrorStates copaysError={copaysError} />)
  }

  describe('when user is enrolled in health care (status !== 403)', () => {
    it('should display enrolled error message', () => {
      const error = { status: 500 }
      initializeTestInstance(error)
      expect(screen.getByText(t('copays.error.header'))).toBeTruthy()
      expect(screen.getByText(t('copays.error.description'))).toBeTruthy()
    })

    it('should display phone number for enrolled users', () => {
      const error = { status: 500 }
      initializeTestInstance(error)
      expect(screen.getByText(displayedTextPhoneNumber(t('8664001238')))).toBeTruthy()
    })
  })

  describe('when user is not enrolled in health care (status === 403)', () => {
    it('should display not enrolled error message', () => {
      const error = { status: 403 }
      initializeTestInstance(error)
      expect(screen.getByText(t('copays.noHealthCare.header'))).toBeTruthy()
    })

    it('should display health care application link', () => {
      const error = { status: 403 }
      initializeTestInstance(error)
      expect(screen.getByTestId('healthCareApplicationLinkID')).toBeTruthy()
    })

    it('should display phone number for non-enrolled users', () => {
      const error = { status: 403 }
      initializeTestInstance(error)
      expect(screen.getByText(displayedTextPhoneNumber(t('8772228387')))).toBeTruthy()
    })

    it('should navigate to webview when health care link is pressed', () => {
      const error = { status: 403 }
      initializeTestInstance(error)
      fireEvent.press(screen.getByTestId('healthCareApplicationLinkID'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
        url: expect.any(String),
        displayTitle: t('webview.vagov'),
        loadingMessage: t('loading.vaWebsite'),
        useSSO: true,
      })
    })
  })

  describe('when error has no status', () => {
    it('should treat as enrolled user', () => {
      const error = { networkError: true }
      initializeTestInstance(error)
      expect(screen.getByText(t('copays.error.header'))).toBeTruthy()
    })
  })
})

import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import CopayErrorStates from 'screens/PaymentsScreen/Copays/CopayErrorStates/CopayErrorStates'
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
  const initializeTestInstance = (httpStatus: number | undefined) => {
    render(<CopayErrorStates httpStatus={httpStatus} />)
  }

  describe('when user is enrolled in health care (status !== 403)', () => {
    it('should display enrolled error message', () => {
      initializeTestInstance(500)
      expect(screen.getByText(t('copays.error.header'))).toBeTruthy()
      expect(screen.getByText(t('copays.error.description'))).toBeTruthy()
    })

    it('should display phone number for enrolled users', () => {
      initializeTestInstance(500)
      expect(screen.getByText(displayedTextPhoneNumber(t('8664001238')))).toBeTruthy()
    })
  })

  describe('when user is not enrolled in health care (status === 403)', () => {
    it('should display not enrolled error message', () => {
      initializeTestInstance(403)
      expect(screen.getByText(t('copays.noHealthCare.header'))).toBeTruthy()
    })

    it('should display health care application link', () => {
      initializeTestInstance(403)
      expect(screen.getByTestId('healthCareApplicationLinkID')).toBeTruthy()
    })

    it('should display phone number for non-enrolled users', () => {
      initializeTestInstance(403)
      expect(screen.getByText(displayedTextPhoneNumber(t('8772228387')))).toBeTruthy()
    })

    it('should navigate to webview when health care link is pressed', () => {
      initializeTestInstance(403)
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
      initializeTestInstance(undefined)
      expect(screen.getByText(t('copays.error.header'))).toBeTruthy()
    })
  })
})

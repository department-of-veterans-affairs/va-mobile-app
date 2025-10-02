import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import CopayEmptyState from 'screens/PaymentsScreen/Copays/CopayEmptyState/CopayEmptyState'
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

context('CopayEmptyState', () => {
  const initializeTestInstance = (testID?: string) => {
    render(<CopayEmptyState testID={testID} />)
  }

  describe('when rendered', () => {
    it('should display the empty state message', () => {
      initializeTestInstance()
      expect(screen.getByText(t('copays.none.header'))).toBeTruthy()
      expect(screen.getByText(t('copays.none.message'))).toBeTruthy()
    })

    it('should display phone number for support', () => {
      initializeTestInstance()
      expect(screen.getByText(displayedTextPhoneNumber(t('8664001238')))).toBeTruthy()
    })

    it('should have proper accessibility attributes', () => {
      initializeTestInstance()
      expect(screen.getByRole('header')).toBeTruthy()
    })

    it('should accept custom testID', () => {
      const customTestID = 'customEmptyStateTestID'
      initializeTestInstance(customTestID)
      expect(screen.getByTestId(customTestID)).toBeTruthy()
    })
  })

  describe('when no testID provided', () => {
    it('should render without testID', () => {
      initializeTestInstance()
      expect(screen.getByText(t('copays.none.header'))).toBeTruthy()
    })
  })
})

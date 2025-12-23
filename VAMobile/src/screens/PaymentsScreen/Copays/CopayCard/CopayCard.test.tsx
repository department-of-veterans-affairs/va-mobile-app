import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { MedicalCopayRecord } from 'api/types/MedicalCopayData'
import CopayCard from 'screens/PaymentsScreen/Copays/CopayCard/CopayCard'
import { context, render } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const mockCopay: MedicalCopayRecord = {
  id: '1',
  pSStatementDateOutput: '01/15/2024',
  pHAmtDue: 50.0,
  pSFacilityNum: '123',
  station: {
    facilitYNum: '123 - Test Facility',
  },
  details: [],
}

const pastDueCopay: MedicalCopayRecord = {
  id: '2',
  pSStatementDateOutput: '01/01/2023', // Old date for past due
  pHAmtDue: 75.0,
  pSFacilityNum: '456',
  station: {
    facilitYNum: '456 - Another Facility',
  },
  details: [],
}

context('CopayCard', () => {
  const initializeTestInstance = (copay: MedicalCopayRecord, index: number, totalCopays: number) => {
    render(<CopayCard copay={copay} index={index} totalCopays={totalCopays} />)
  }

  describe('when rendered with current balance', () => {
    it('should display facility name', () => {
      initializeTestInstance(mockCopay, 0, 1)
      expect(screen.getByText('123 - Test Facility')).toBeTruthy()
    })

    it('should display balance amount', () => {
      initializeTestInstance(mockCopay, 0, 1)
      expect(screen.getByText('$50.00')).toBeTruthy()
    })

    it('should display current balance summary', () => {
      initializeTestInstance(mockCopay, 0, 1)
      expect(screen.getByText(/January 15, 2024/)).toBeTruthy()
    })

    it('should display resolve bill button', () => {
      initializeTestInstance(mockCopay, 0, 1)
      expect(screen.getByText(t('copays.resolveCopay'))).toBeTruthy()
    })

    it('should display review details link', () => {
      initializeTestInstance(mockCopay, 0, 1)
      expect(screen.getByText(t('copays.reviewDetails'))).toBeTruthy()
    })

    it('should navigate to details when review details is pressed', () => {
      initializeTestInstance(mockCopay, 0, 1)
      fireEvent.press(screen.getByText(t('copays.reviewDetails')))
      expect(mockNavigationSpy).toHaveBeenCalledWith('CopayDetails', { copay: mockCopay })
    })
  })

  describe('when rendered with past due balance', () => {
    it('should display past due summary', () => {
      initializeTestInstance(pastDueCopay, 0, 1)
      expect(screen.getByText(/January 1, 2023/)).toBeTruthy()
    })
  })

  describe('facility name parsing', () => {
    it('should parse facility name correctly', () => {
      initializeTestInstance(mockCopay, 0, 1)
      expect(screen.getByText('123 - Test Facility')).toBeTruthy()
    })

    it('should handle facility name without dash separator', () => {
      const copayWithoutDash = {
        ...mockCopay,
        station: {
          facilitYNum: '123TestFacility',
        },
      }
      initializeTestInstance(copayWithoutDash, 0, 1)
      expect(screen.getByText('123TestFacility')).toBeTruthy()
    })
  })
})

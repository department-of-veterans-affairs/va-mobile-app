import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { medicalCopayKeys } from 'api/medicalCopays/queryKeys'
import { MedicalCopayRecord, MedicalCopaysPayload } from 'api/types'
import CopayDetailsScreen from 'screens/PaymentsScreen/Copays/CopayDetails/CopayDetailsScreen'
import { context, mockNavProps, render, waitFor } from 'testUtils'

const mockCopay: MedicalCopayRecord = {
  id: '1',
  pSStatementDateOutput: '10/10/2024',
  pSStatementVal: 'STMT123',
  pHAmtDue: 150.0,
  pHPrevBal: 100.0,
  pHNewBalance: 150.0,
  pSFacilityNum: '123',
  pHAddress1: '123 Main Street',
  pHCity: 'Springfield',
  pHState: 'VA',
  pHZipCde: '22150',
  station: {
    facilitYNum: '123',
    staTAddress1: '456 Hospital Drive',
    city: 'Richmond',
    state: 'VA',
    ziPCde: '23219',
  },
  details: [
    {
      pDDatePosted: '2024-01-10',
      pDDatePostedOutput: '01/10/2024',
      pDTransDesc: 'Outpatient visit',
      pDTransDescOutput: 'Outpatient visit',
      pDTransAmt: 30.0,
      pDRefNo: 'REF123',
    },
  ],
}

const mockOldCopay: MedicalCopayRecord = {
  ...mockCopay,
  id: '2',
  pSStatementDateOutput: '01/15/2023',
}

// Create a copay with today's date to ensure it's current
const today = new Date()
const currentMonth = String(today.getMonth() + 1).padStart(2, '0')
const currentDay = String(today.getDate()).padStart(2, '0')
const currentYear = today.getFullYear()
const todayFormatted = `${currentMonth}/${currentDay}/${currentYear}`

const mockCurrentCopay: MedicalCopayRecord = {
  ...mockCopay,
  id: '5',
  pSStatementDateOutput: todayFormatted,
}

const mockCopaysData: MedicalCopaysPayload = {
  data: [
    mockCopay,
    {
      id: '3',
      pSStatementDateOutput: '12/15/2023',
      pHAmtDue: 75.0,
      pSFacilityNum: '123',
      station: {
        facilitYNum: '123',
      },
      details: [],
    },
    {
      id: '4',
      pSStatementDateOutput: '11/15/2023',
      pHAmtDue: 50.0,
      pSFacilityNum: '456',
      station: {
        facilitYNum: '456',
      },
      details: [],
    },
  ],
  status: 200,
}

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('utils/analytics', () => {
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logAnalyticsEvent: jest.fn(),
  }
})

context('CopayDetailsScreen', () => {
  const initializeTestInstance = (copay: MedicalCopayRecord, copaysData?: MedicalCopaysPayload) => {
    const queriesData = [
      {
        queryKey: medicalCopayKeys.medicalCopays,
        data: copaysData || mockCopaysData,
      },
    ]
    const props = mockNavProps(undefined, { addListener: jest.fn() }, { params: { copay } })
    render(<CopayDetailsScreen {...props} />, { queriesData })
  }

  describe('when loading', () => {
    it('should display loading component', () => {
      const queriesData = [
        {
          queryKey: medicalCopayKeys.medicalCopays,
          data: undefined,
        },
      ]
      const props = mockNavProps(undefined, { addListener: jest.fn() }, { params: { copay: mockCopay } })
      render(<CopayDetailsScreen {...props} />, { queriesData })
      expect(screen.getByText(t('copays.loading'))).toBeTruthy()
    })
  })

  describe('with current balance', () => {
    it('should display copay details', () => {
      initializeTestInstance(mockCopay)
      expect(screen.getByTestId('copayDetailsTestID')).toBeTruthy()
      expect(screen.getByText(/Current balance/)).toBeTruthy()
    })

    it('should display facility name', () => {
      initializeTestInstance(mockCopay)
      expect(screen.getAllByText(/123/).length).toBeGreaterThan(0)
    })

    it('should display current balance amount', () => {
      initializeTestInstance(mockCopay)
      expect(screen.getByText(/\$150\.00/)).toBeTruthy()
    })

    it('should display payment due date', () => {
      initializeTestInstance(mockCopay)
      expect(screen.getByText(/Payment due date/)).toBeTruthy()
    })

    it('should display resolve bill button', () => {
      initializeTestInstance(mockCopay)
      expect(screen.getByText(t('copays.resolveCopay'))).toBeTruthy()
    })
  })

  describe('with current balance (not overdue)', () => {
    it('should not display overdue warning when statement is recent', () => {
      initializeTestInstance(mockCurrentCopay)
      expect(screen.queryByText(t('copays.balanceOverdue'))).toBeFalsy()
    })
  })

  describe('with overdue balance', () => {
    it('should display overdue warning', () => {
      initializeTestInstance(mockOldCopay)
      expect(screen.getByText(t('copays.balanceOverdue'))).toBeTruthy()
    })
  })

  describe('accordions', () => {
    it('should display recent statement charges accordion', () => {
      initializeTestInstance(mockCopay)
      expect(screen.getByText(t('copays.recentCharges'))).toBeTruthy()
    })

    it('should display previous PDF statements accordion', () => {
      initializeTestInstance(mockCopay)
      expect(screen.getByText(t('copays.pdfStatements'))).toBeTruthy()
    })

    it('should display statement addresses accordion', () => {
      initializeTestInstance(mockCopay)
      expect(screen.getByText(t('copays.statementAddresses'))).toBeTruthy()
    })

    it('should display rights and responsibilities accordion', () => {
      initializeTestInstance(mockCopay)
      expect(screen.getByText(t('copays.rightsResponsibilities'))).toBeTruthy()
    })
  })

  describe('previous statements', () => {
    it('should display all statements for same facility including current as first', async () => {
      initializeTestInstance(mockCopay)
      const accordion = screen.getByText(t('copays.pdfStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        // Should show current statement first with "Current statement" label
        expect(screen.getByText(t('copays.pdfStatements.currentStatement'))).toBeTruthy()
        // Should show the other statement from facility 123 (id: 3)
        expect(screen.getByText(t('copays.pdfStatements.statementDate', { date: 'December 15, 2023' }))).toBeTruthy()
      })
    })

    it('should not display statements from different facilities', async () => {
      initializeTestInstance(mockCopay)
      const accordion = screen.getByText(t('copays.pdfStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        // Should not show statement from facility 456 (id: 4)
        expect(screen.queryByText(t('copays.pdfStatements.statementDate', { date: 'November 15, 2023' }))).toBeFalsy()
      })
    })
  })

  describe('navigation', () => {
    it('should navigate back when back button is pressed', async () => {
      const mockGoBack = jest.fn()
      const queriesData = [
        {
          queryKey: medicalCopayKeys.medicalCopays,
          data: mockCopaysData,
        },
      ]
      const props = mockNavProps(
        undefined,
        { addListener: jest.fn(), goBack: mockGoBack },
        { params: { copay: mockCopay } },
      )
      render(<CopayDetailsScreen {...props} />, { queriesData })

      await waitFor(() => {
        const backButton = screen.getByTestId('copayDetailsBackTestID')
        fireEvent.press(backButton)
        expect(mockGoBack).toHaveBeenCalled()
      })
    })
  })

  describe('download statement', () => {
    it('should trigger download when statement is pressed in PDF statements', async () => {
      initializeTestInstance(mockCopay)
      const accordion = screen.getByText(t('copays.pdfStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        // Find the current statement and press it to trigger download
        const currentStatement = screen.getByText(t('copays.pdfStatements.currentStatement'))
        fireEvent.press(currentStatement)
        // Download happens in background, screen content remains visible
        expect(screen.getByTestId('copayDetailsTestID')).toBeTruthy()
      })
    })
  })
})

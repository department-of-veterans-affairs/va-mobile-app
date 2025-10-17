import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { MedicalCopayRecord } from 'api/types'
import PreviousPDFStatements from 'screens/PaymentsScreen/Copays/CopayDetails/PreviousPDFStatements'
import { context, render, waitFor } from 'testUtils'

const mockStatements: MedicalCopayRecord[] = [
  {
    id: '1',
    pSStatementDateOutput: '12/15/2024',
    pHAmtDue: 100.0,
    pSFacilityNum: '123',
    station: {
      facilitYNum: '123 - Test Facility',
    },
    details: [],
  },
  {
    id: '2',
    pSStatementDateOutput: '11/15/2024',
    pHAmtDue: 75.0,
    pSFacilityNum: '123',
    station: {
      facilitYNum: '123 - Test Facility',
    },
    details: [],
  },
  {
    id: '3',
    pSStatementDateOutput: '10/15/2024',
    pHAmtDue: 50.0,
    pSFacilityNum: '123',
    station: {
      facilitYNum: '123 - Test Facility',
    },
    details: [],
  },
]

const emptyStatements: MedicalCopayRecord[] = []

context('PreviousPDFStatements', () => {
  const mockDownloadStatement = jest.fn()

  beforeEach(() => {
    mockDownloadStatement.mockClear()
  })

  const initializeTestInstance = (statements: MedicalCopayRecord[]) => {
    render(<PreviousPDFStatements statements={statements} downloadStatement={mockDownloadStatement} />)
  }

  describe('with statements', () => {
    it('should display accordion header', () => {
      initializeTestInstance(mockStatements)
      expect(screen.getByText(t('copays.previousStatements'))).toBeTruthy()
    })

    it('should display description when expanded', async () => {
      initializeTestInstance(mockStatements)
      const accordion = screen.getByText(t('copays.previousStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(t('copays.previousStatements.description'))).toBeTruthy()
      })
    })

    it('should display all statement dates', async () => {
      initializeTestInstance(mockStatements)
      const accordion = screen.getByText(t('copays.previousStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(
          screen.getByText(t('copays.previousStatements.statementDate', { date: 'December 15, 2024' })),
        ).toBeTruthy()
        expect(
          screen.getByText(t('copays.previousStatements.statementDate', { date: 'November 15, 2024' })),
        ).toBeTruthy()
        expect(
          screen.getByText(t('copays.previousStatements.statementDate', { date: 'October 15, 2024' })),
        ).toBeTruthy()
      })
    })

    it('should call downloadStatement when statement is pressed', async () => {
      initializeTestInstance(mockStatements)
      const accordion = screen.getByText(t('copays.previousStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        const firstStatement = screen.getByText(
          t('copays.previousStatements.statementDate', { date: 'December 15, 2024' }),
        )
        fireEvent.press(firstStatement)
        expect(mockDownloadStatement).toHaveBeenCalledWith('1')
      })
    })

    it('should call downloadStatement with correct ID for each statement', async () => {
      initializeTestInstance(mockStatements)
      const accordion = screen.getByText(t('copays.previousStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        const secondStatement = screen.getByText(
          t('copays.previousStatements.statementDate', { date: 'November 15, 2024' }),
        )
        fireEvent.press(secondStatement)
        expect(mockDownloadStatement).toHaveBeenCalledWith('2')
      })
    })

    it('should display all statement items as pressable', async () => {
      initializeTestInstance(mockStatements)
      const accordion = screen.getByText(t('copays.previousStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(
          screen.getByText(t('copays.previousStatements.statementDate', { date: 'December 15, 2024' })),
        ).toBeTruthy()
        expect(
          screen.getByText(t('copays.previousStatements.statementDate', { date: 'November 15, 2024' })),
        ).toBeTruthy()
        expect(
          screen.getByText(t('copays.previousStatements.statementDate', { date: 'October 15, 2024' })),
        ).toBeTruthy()
      })
    })
  })

  describe('with no statements', () => {
    it('should display accordion header', () => {
      initializeTestInstance(emptyStatements)
      expect(screen.getByText(t('copays.previousStatements'))).toBeTruthy()
    })

    it('should display description with no statements', async () => {
      initializeTestInstance(emptyStatements)
      const accordion = screen.getByText(t('copays.previousStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(t('copays.previousStatements.description'))).toBeTruthy()
      })
    })

    it('should not display any statement items', async () => {
      initializeTestInstance(emptyStatements)
      const accordion = screen.getByText(t('copays.previousStatements'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(t('copays.previousStatements.description'))).toBeTruthy()
        // No statement dates should be present
        expect(screen.queryByText(/statement \(PDF\)/)).toBeFalsy()
      })
    })
  })
})

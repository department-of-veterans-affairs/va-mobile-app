import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { MedicalCopayRecord } from 'api/types'
import RecentStatementCharges from 'screens/PaymentsScreen/Copays/CopayDetails/RecentStatementCharges'
import { context, render, waitFor } from 'testUtils'

const mockCopayWithCharges: MedicalCopayRecord = {
  id: '1',
  pSStatementDateOutput: '01/15/2024',
  pSStatementVal: 'STMT123',
  pHAmtDue: 150.0,
  pHPrevBal: 100.0,
  pHNewBalance: 150.0,
  pSFacilityNum: '123',
  station: {
    facilitYNum: '123 - Test Facility',
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
    {
      pDDatePosted: '2024-01-12',
      pDDatePostedOutput: '01/12/2024',
      pDTransDesc: 'Lab test',
      pDTransDescOutput: 'Lab test',
      pDTransAmt: 20.0,
      pDRefNo: 'REF456',
    },
    {
      pDDatePosted: '2024-01-15',
      pDTransDesc: 'interest/adm charge',
      pDTransDescOutput: 'Interest/Admin charge',
      pDTransAmt: 5.0,
    },
  ],
}

const mockCopayNoCharges: MedicalCopayRecord = {
  id: '2',
  pSStatementDateOutput: '02/15/2024',
  pHAmtDue: 50.0,
  pHPrevBal: 50.0,
  pHNewBalance: 50.0,
  pSFacilityNum: '456',
  pSStatementVal: 'STMT456',
  station: {
    facilitYNum: '456 - Another Facility',
  },
  details: [
    {
      pDTransDescOutput: '&nbsp;No charges',
    },
  ],
}

context('RecentStatementCharges', () => {
  const initializeTestInstance = (copay: MedicalCopayRecord) => {
    render(<RecentStatementCharges copay={copay} />)
  }

  describe('with charges', () => {
    it('should display accordion header', () => {
      initializeTestInstance(mockCopayWithCharges)
      expect(screen.getByText(t('copays.recentCharges'))).toBeTruthy()
    })

    it('should display previous balance', async () => {
      initializeTestInstance(mockCopayWithCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(t('copays.recentCharges.previousBalance'))).toBeTruthy()
        expect(screen.getByText('$100.00')).toBeTruthy()
      })
    })

    it('should display current balance', async () => {
      initializeTestInstance(mockCopayWithCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(t('copays.currentBalance'))).toBeTruthy()
        expect(screen.getByText('$150.00')).toBeTruthy()
      })
    })

    it('should display charge details', async () => {
      initializeTestInstance(mockCopayWithCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText('Outpatient visit')).toBeTruthy()
        expect(screen.getByText('Lab test')).toBeTruthy()
      })
    })

    it('should display formatted dates', async () => {
      initializeTestInstance(mockCopayWithCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText('January 10, 2024')).toBeTruthy()
        expect(screen.getByText('January 12, 2024')).toBeTruthy()
      })
    })

    it('should display billing references', async () => {
      initializeTestInstance(mockCopayWithCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(`${t('copays.recentCharges.billingReference')} REF123`)).toBeTruthy()
        expect(screen.getByText(`${t('copays.recentCharges.billingReference')} REF456`)).toBeTruthy()
      })
    })

    it('should display charge amounts', async () => {
      initializeTestInstance(mockCopayWithCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText('$30.00')).toBeTruthy()
        expect(screen.getByText('$20.00')).toBeTruthy()
        expect(screen.getByText('$5.00')).toBeTruthy()
      })
    })

    it('should display interest/admin charges', async () => {
      initializeTestInstance(mockCopayWithCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText('Interest/Admin charge')).toBeTruthy()
      })
    })

    it('should use statement date for interest/adm charges without date', async () => {
      initializeTestInstance(mockCopayWithCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        // Interest charge should use copay statement date since it has no pDDatePostedOutput
        expect(screen.getByText('January 15, 2024')).toBeTruthy()
      })
    })

    it('should use statement value for interest/adm charges without reference', async () => {
      initializeTestInstance(mockCopayWithCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        // Interest charge should use copay statement value as reference
        expect(screen.getByText(`${t('copays.recentCharges.billingReference')} STMT123`)).toBeTruthy()
      })
    })
  })

  describe('with no valid charges', () => {
    it('should display accordion header', () => {
      initializeTestInstance(mockCopayNoCharges)
      expect(screen.getByText(t('copays.recentCharges'))).toBeTruthy()
    })

    it('should display balances even with no charges', async () => {
      initializeTestInstance(mockCopayNoCharges)
      const accordion = screen.getByText(t('copays.recentCharges'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(t('copays.recentCharges.previousBalance'))).toBeTruthy()
        expect(screen.getByText(t('copays.currentBalance'))).toBeTruthy()
      })
    })
  })
})

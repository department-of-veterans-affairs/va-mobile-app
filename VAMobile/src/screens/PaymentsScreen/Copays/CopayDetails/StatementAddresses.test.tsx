import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { MedicalCopayRecord } from 'api/types'
import StatementAddresses from 'screens/PaymentsScreen/Copays/CopayDetails/StatementAddresses'
import { context, render, waitFor } from 'testUtils'

const mockCopay: MedicalCopayRecord = {
  id: '1',
  pSStatementDateOutput: '01/15/2024',
  pHAmtDue: 150.0,
  pSFacilityNum: '123',
  pHAddress1: '123 Main Street',
  pHAddress2: 'Apt 4B',
  pHAddress3: 'Building C',
  pHCity: 'Springfield',
  pHState: 'VA',
  pHZipCde: '22150',
  station: {
    facilitYNum: '123 - Test Facility',
    staTAddress1: '456 Hospital Drive',
    staTAddress2: 'Suite 200',
    staTAddress3: 'Medical Center',
    city: 'Richmond',
    state: 'VA',
    ziPCde: '23219',
  },
  details: [],
}

const mockCopayMinimalAddress: MedicalCopayRecord = {
  id: '2',
  pSStatementDateOutput: '02/15/2024',
  pHAmtDue: 75.0,
  pSFacilityNum: '456',
  pHAddress1: '789 Oak Avenue',
  pHCity: 'Norfolk',
  pHState: 'VA',
  pHZipCde: '23510',
  station: {
    facilitYNum: '456 - Another Facility',
    staTAddress1: '321 Medical Blvd',
    city: 'Norfolk',
    state: 'VA',
    ziPCde: '23510',
  },
  details: [],
}

context('StatementAddresses', () => {
  const initializeTestInstance = (copay: MedicalCopayRecord, facilityName: string) => {
    render(<StatementAddresses copay={copay} facilityName={facilityName} />)
  }

  describe('with full address details', () => {
    it('should display accordion header', () => {
      initializeTestInstance(mockCopay, 'Test Facility')
      expect(screen.getByText(t('copays.statementAddresses'))).toBeTruthy()
    })

    it('should display sender address when expanded', async () => {
      initializeTestInstance(mockCopay, 'Test Facility')
      const accordion = screen.getByText(t('copays.statementAddresses'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(t('copays.statementAddresses.senderAddress'))).toBeTruthy()
        expect(screen.getByText('Test Facility')).toBeTruthy()
        expect(screen.getByText('456 Hospital Drive')).toBeTruthy()
        expect(screen.getByText('Suite 200')).toBeTruthy()
        expect(screen.getByText('Medical Center')).toBeTruthy()
        expect(screen.getByText('Richmond, VA 23219')).toBeTruthy()
      })
    })

    it('should display recipient address when expanded', async () => {
      initializeTestInstance(mockCopay, 'Test Facility')
      const accordion = screen.getByText(t('copays.statementAddresses'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(t('copays.statementAddresses.recipientAddress'))).toBeTruthy()
        expect(screen.getByText('123 Main Street')).toBeTruthy()
        expect(screen.getByText('Apt 4B')).toBeTruthy()
        expect(screen.getByText('Building C')).toBeTruthy()
        expect(screen.getByText('Springfield, VA 22150')).toBeTruthy()
      })
    })

    it('should display note with phone number', async () => {
      initializeTestInstance(mockCopay, 'Test Facility')
      const accordion = screen.getByText(t('copays.statementAddresses'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText(/If your address has changed, call/)).toBeTruthy()
        expect(screen.getByTestId('CallVATestID')).toBeTruthy()
        expect(screen.getByText('866-260-2614')).toBeTruthy()
      })
    })
  })

  describe('with minimal address details', () => {
    it('should display sender address without optional fields', async () => {
      initializeTestInstance(mockCopayMinimalAddress, 'Another Facility')
      const accordion = screen.getByText(t('copays.statementAddresses'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText('Another Facility')).toBeTruthy()
        expect(screen.getByText('321 Medical Blvd')).toBeTruthy()
        expect(screen.getAllByText('Norfolk, VA 23510').length).toBeGreaterThan(0)
        // Optional fields should not be present
        expect(screen.queryByText('Suite 200')).toBeFalsy()
        expect(screen.queryByText('Medical Center')).toBeFalsy()
      })
    })

    it('should display recipient address without optional fields', async () => {
      initializeTestInstance(mockCopayMinimalAddress, 'Another Facility')
      const accordion = screen.getByText(t('copays.statementAddresses'))
      fireEvent.press(accordion)
      await waitFor(() => {
        expect(screen.getByText('789 Oak Avenue')).toBeTruthy()
        expect(screen.getAllByText('Norfolk, VA 23510').length).toBeGreaterThan(0)
        // Optional fields should not be present
        expect(screen.queryByText('Apt 4B')).toBeFalsy()
        expect(screen.queryByText('Building C')).toBeFalsy()
      })
    })
  })
})

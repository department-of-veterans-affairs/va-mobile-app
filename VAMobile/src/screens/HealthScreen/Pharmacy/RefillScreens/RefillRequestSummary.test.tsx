import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { RefillRequestSummaryItems } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

import RefillRequestSummary from './RefillRequestSummary'

context('RefillRequestSummary', () => {
  const initializeTestInstance = (refillRequestSummaryItems?: RefillRequestSummaryItems) => {
    const props = mockNavProps(
      {},
      { setOptions: jest.fn(), navigate: jest.fn(), addListener: jest.fn() },
      {
        params: {
          refillRequestSummaryItems: refillRequestSummaryItems,
        },
      },
    )
    render(<RefillRequestSummary {...props} />)
  }

  describe('when all request submit successfully', () => {
    it('should display successful summary', () => {
      initializeTestInstance([
        {
          data: mockData[0],
          submitted: true,
        },
      ] as RefillRequestSummaryItems)

      expect(screen.getByText(t('prescriptions.refillRequestSummary.success'))).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescriptions.refillRequestSummary') })).toBeTruthy()
      expect(
        screen.getByLabelText(
          `ALLOPURINOL 100MG TAB. ${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 6 9 1. ${t('prescriptions.refillRequestSummary.pendingRefills.requestSubmitted')}`,
        ),
      ).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescriptions.refillRequestSummary.whatsNext') })).toBeTruthy()
      expect(
        screen.getByLabelText(a11yLabelVA(t('prescriptions.refillRequestSummary.yourRefills.success.1'))),
      ).toBeTruthy()
      expect(
        screen.getByLabelText(a11yLabelVA(t('prescriptions.refillRequestSummary.yourRefills.success.2'))),
      ).toBeTruthy()
      expect(screen.getByRole('button', { name: t('prescriptions.refillRequestSummary.pendingRefills') })).toBeTruthy()
    })
  })

  describe('when all request failed', () => {
    it('should display fail summary', () => {
      initializeTestInstance([
        {
          data: mockData[0],
          submitted: false,
        },
      ] as RefillRequestSummaryItems)

      expect(screen.getByText(t('prescriptions.refillRequestSummary.mix', { count: 1 }))).toBeTruthy()
      expect(screen.getByText(t('prescriptions.refillRequestSummary.tryAgain'))).toBeTruthy()
      expect(screen.getByRole('button', { name: t('tryAgain') })).toBeTruthy()
      expect(screen.getByText(t('prescriptions.refillRequestSummary'))).toBeTruthy()
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText(`${t('prescription.rxNumber')} 3636691`)).toBeTruthy()
      expect(screen.queryByText(t('prescriptions.refillRequestSummary.whatsNext'))).toBeFalsy()
    })
  })

  describe('when some request succeed and some failed', () => {
    it('should display mix summary', () => {
      initializeTestInstance([
        {
          data: mockData[0],
          submitted: true,
        },
        {
          data: mockData[1],
          submitted: false,
        },
      ] as RefillRequestSummaryItems)
      expect(screen.getByRole('button', { name: t('tryAgain') })).toBeTruthy()
      expect(screen.getByRole('button', { name: t('prescriptions.refillRequestSummary.pendingRefills') })).toBeTruthy()
      expect(screen.getByText(t('prescriptions.refillRequestSummary.mix', { count: 1 }))).toBeTruthy()
      expect(screen.getByText(t('prescriptions.refillRequestSummary.tryAgain'))).toBeTruthy()
      expect(screen.getByText(t('prescriptions.refillRequestSummary'))).toBeTruthy()
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText(`${t('prescription.rxNumber')} 3636691`)).toBeTruthy()
      expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy()
      expect(screen.getByText(`${t('prescription.rxNumber')} 3636711A`)).toBeTruthy()
      expect(screen.getByText(t('prescriptions.refillRequestSummary.whatsNext'))).toBeTruthy()
      expect(screen.getByText(t('prescriptions.refillRequestSummary.yourRefills.success.1'))).toBeTruthy()
      expect(screen.getByText(t('prescriptions.refillRequestSummary.yourRefills.success.2'))).toBeTruthy()
    })
  })
})

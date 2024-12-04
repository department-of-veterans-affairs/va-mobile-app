import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { PrescriptionsGetData } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

import { RefillScreen } from './RefillScreen'

context('RefillScreen', () => {
  const mock: PrescriptionsGetData = {
    data: mockData,
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalEntries: 2,
      },
      prescriptionStatusCount: {
        active: 2,
        isRefillable: 2,
        discontinued: 0,
        expired: 0,
        historical: 0,
        pending: 0,
        transferred: 0,
        submitted: 0,
        hold: 0,
        unknown: 0,
        total: 0,
      },
    },
    links: {
      self: '',
      first: '',
      prev: '',
      next: '',
      last: '',
    },
  }
  const emptyMock: PrescriptionsGetData = {
    data: [],
    meta: {
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalEntries: 0,
      },
      prescriptionStatusCount: {
        active: 0,
        isRefillable: 0,
        discontinued: 0,
        expired: 0,
        historical: 0,
        pending: 0,
        transferred: 0,
        submitted: 0,
        hold: 0,
        unknown: 0,
        total: 0,
      },
    },
    links: {
      self: '',
      first: '',
      prev: '',
      next: '',
      last: '',
    },
  }
  const initializeTestInstance = () => {
    const props = mockNavProps(
      {},
      {
        setOptions: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
      {
        params: {
          refillRequestSummaryItems: undefined,
        },
      },
    )
    render(<RefillScreen {...props} />)
  }

  describe('when there are refillable prescriptions', () => {
    it('should show prescription info and Request Refills button', async () => {
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status', // Parameters are snake case for the back end
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue(mock)
      initializeTestInstance()
      await waitFor(() =>
        expect(
          screen.getByLabelText(`${t('prescription.history.orderIdentifier', { idx: 1, total: 2 })}.`),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB.' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 6 9 1.`)).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByLabelText(`${t('prescription.refillsLeft')} 1.`)).toBeTruthy())
      await waitFor(() => expect(screen.getByLabelText(`${t('fillDate')} September 21, 2021.`)).toBeTruthy())
      await waitFor(() =>
        expect(screen.getAllByLabelText(`${a11yLabelVA(t('prescription.vaFacility'))} SLC10 TEST LAB.`)).toBeTruthy(),
      )

      await waitFor(() =>
        expect(
          screen.getByLabelText(`${t('prescription.history.orderIdentifier', { idx: 2, total: 2 })}.`),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('header', { name: 'AMLODIPINE BESYLATE 10MG TAB.' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 7 1 1 A.`)).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByLabelText(`${t('prescription.refillsLeft')} 6.`)).toBeTruthy())
      await waitFor(() => expect(screen.getByLabelText(`${t('fillDate')} May 15, 2022.`)).toBeTruthy())

      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle_plural') }),
        ).toBeTruthy(),
      )
    })
  })

  describe('if there are no refillable prescriptions', () => {
    it('should show NoRefills component', async () => {
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status', // Parameters are snake case for the back end
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue(emptyMock)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: t('prescriptions.noRefill.header') })).toBeTruthy())
    })
  })

  describe('if no prescription is selected', () => {
    it('should show alert for no prescription selected', async () => {
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status', // Parameters are snake case for the back end
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue(mock)
      initializeTestInstance()
      await waitFor(() =>
        fireEvent.press(
          screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle_plural') }),
        ),
      )
      await waitFor(() => expect(screen.getByText(t('prescriptions.refill.pleaseSelect'))).toBeTruthy())
    })
  })
})

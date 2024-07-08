import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { PrescriptionsGetData } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
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

  describe('no there are no refillable prescriptions', () => {
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
      await waitFor(() => expect(screen.getByText('You have no prescriptions for refill')).toBeTruthy())
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
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'Request refills' })))
      await waitFor(() => expect(screen.getByText('Please select a prescription')).toBeTruthy())
    })
  })
})

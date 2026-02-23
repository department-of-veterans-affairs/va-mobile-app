import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { PrescriptionsGetData } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { RefillScreen } from 'screens/HealthScreen/Pharmacy/RefillScreens/RefillScreen'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

jest.mock('api/authorizedServices/getAuthorizedServices')

const mockUseAuthorizedServices = useAuthorizedServices as jest.Mock

context('RefillScreen', () => {
  const migratingFacilitiesList = [
    {
      migrationDate: '2026-05-01',
      facilities: [
        { facilityId: 979, facilityName: 'SLC10 TEST LAB' }, // Matches stationNumber in mockData
      ],
      phases: {
        current: 'p3',
        p0: 'March 1, 2026',
        p1: 'March 15, 2026',
        p2: 'April 1, 2026',
        p3: 'April 24, 2026',
        p4: 'April 27, 2026',
        p5: 'May 1, 2026',
        p6: 'May 3, 2026',
        p7: 'May 8, 2026',
      },
    },
  ]
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
      hasNonVaMeds: false,
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
      hasNonVaMeds: false,
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

  beforeEach(() => {
    // Default mock with no migrating facilities
    mockUseAuthorizedServices.mockReturnValue({
      data: {
        migratingFacilitiesList: [],
      },
    })
  })

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
      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 6 9 1`)).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByLabelText(`${t('prescription.refillsLeft')} 1`)).toBeTruthy())
      await waitFor(() => expect(screen.getByLabelText(`${t('fillDate')} September 21, 2021`)).toBeTruthy())
      await waitFor(() =>
        expect(screen.getAllByLabelText(`${a11yLabelVA(t('prescription.vaFacility'))} SLC10 TEST LAB`)).toBeTruthy(),
      )

      await waitFor(() =>
        expect(
          screen.getByLabelText(`${t('prescription.history.orderIdentifier', { idx: 2, total: 2 })}.`),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('header', { name: 'AMLODIPINE BESYLATE 10MG TAB' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 7 1 1 A`)).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByLabelText(`${t('prescription.refillsLeft')} 6`)).toBeTruthy())
      await waitFor(() => expect(screen.getByLabelText(`${t('fillDate')} May 15, 2022`)).toBeTruthy())

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

  describe('migrating facilities banner', () => {
    it('should show banner when prescriptions are at migrating facilities', async () => {
      mockUseAuthorizedServices.mockReturnValue({
        data: {
          migratingFacilitiesList: migratingFacilitiesList,
        },
      })
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status',
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue(mock)
      initializeTestInstance()
      // Banner should show with affected medication names as links
      await waitFor(() => expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy())
    })

    it('should not show banner when no prescriptions are at migrating facilities', async () => {
      mockUseAuthorizedServices.mockReturnValue({
        data: {
          migratingFacilitiesList: [
            {
              migrationDate: '2026-05-01',
              facilities: [
                { facilityId: 999, facilityName: 'Other VA Medical Center' }, // Does not match stationNumber in mockData
              ],
              phases: {
                current: 'p3',
                p0: 'March 1, 2026',
                p1: 'March 15, 2026',
                p2: 'April 1, 2026',
                p3: 'April 24, 2026',
                p4: 'April 27, 2026',
                p5: 'May 1, 2026',
                p6: 'May 3, 2026',
                p7: 'May 8, 2026',
              },
            },
          ],
        },
      })
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status',
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue(mock)
      initializeTestInstance()
      // Should still show prescription headers but not the banner content
      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
      // Banner title should not be present since no prescriptions match migrating facilities
      await waitFor(() => expect(screen.queryByText(t('prescription.details.banner.title'))).toBeNull())
    })

    it('should not show banner when migratingFacilitiesList is empty', async () => {
      mockUseAuthorizedServices.mockReturnValue({
        data: {
          migratingFacilitiesList: [],
        },
      })
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status',
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue(mock)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
      await waitFor(() => expect(screen.queryByText(t('prescription.details.banner.title'))).toBeNull())
    })

    it('should not show banner when userAuthorizedServices is undefined', async () => {
      mockUseAuthorizedServices.mockReturnValue({
        data: undefined,
      })
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status',
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue(mock)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
      await waitFor(() => expect(screen.queryByText(t('prescription.details.banner.title'))).toBeNull())
    })
  })
})

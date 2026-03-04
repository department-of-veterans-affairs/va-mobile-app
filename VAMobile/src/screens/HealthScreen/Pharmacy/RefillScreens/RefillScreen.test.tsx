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
import { featureEnabled } from 'utils/remoteConfig'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

jest.mock('utils/remoteConfig')
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

  const apiParams = {
    'page[number]': '1',
    'page[size]': LARGE_PAGE_SIZE.toString(),
    sort: 'refill_status',
  }

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
    // Default: no migrating facilities, cutover flag off
    mockUseAuthorizedServices.mockReturnValue({
      data: {
        migratingFacilitiesList: [],
      },
    })
    when(featureEnabled as jest.Mock)
      .calledWith('mhvMedicationsOracleHealthCutover')
      .mockReturnValue(false)
  })

  // ============================================================
  // Base behavior (cutover flag OFF, no migrating facilities)
  // ============================================================
  describe('when there are refillable prescriptions', () => {
    it('should show prescription info and Request Refills button', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', apiParams)
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
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', apiParams)
        .mockResolvedValue(emptyMock)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: t('prescriptions.noRefill.header') })).toBeTruthy())
    })
  })

  describe('if no prescription is selected', () => {
    it('should show alert for no prescription selected', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', apiParams)
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

  // ============================================================
  // Migrating facilities banner (requires cutover flag ON)
  // ============================================================
  describe('migrating facilities banner', () => {
    describe('when cutover flag is enabled', () => {
      beforeEach(() => {
        when(featureEnabled as jest.Mock)
          .calledWith('mhvMedicationsOracleHealthCutover')
          .mockReturnValue(true)
      })

      it('should show banner when prescriptions are at migrating facilities', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: migratingFacilitiesList,
          },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() =>
          expect(screen.getByText("You can't refill prescriptions online for some facilities right now")).toBeTruthy(),
        )
      })

      it('should show migrating prescription names in the banner', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: migratingFacilitiesList,
          },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy())
        await waitFor(() => expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy())
      })

      it('should show custom footer text in the banner', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: migratingFacilitiesList,
          },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() =>
          expect(screen.getByText(t('prescription.refill.banner.migrating.body'))).toBeTruthy(),
        )
      })

      it('should not show banner when no prescriptions match migrating facilities', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: [
              {
                migrationDate: '2026-05-01',
                facilities: [{ facilityId: 999, facilityName: 'Other VA Medical Center' }],
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
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
        await waitFor(() =>
          expect(screen.queryByText("You can't refill prescriptions online for some facilities right now")).toBeFalsy(),
        )
      })

      it('should not show banner when migratingFacilitiesList is empty', async () => {
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
        await waitFor(() =>
          expect(screen.queryByText("You can't refill prescriptions online for some facilities right now")).toBeFalsy(),
        )
      })

      it('should not show banner when userAuthorizedServices is undefined', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: undefined,
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
        await waitFor(() =>
          expect(screen.queryByText("You can't refill prescriptions online for some facilities right now")).toBeFalsy(),
        )
      })
    })

    describe('when cutover flag is disabled', () => {
      it('should not show banner even when prescriptions are at migrating facilities', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: migratingFacilitiesList,
          },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        // Banner should not render because isOHCutoverFlagEnabled is false
        await waitFor(() =>
          expect(screen.queryByText("You can't refill prescriptions online for some facilities right now")).toBeFalsy(),
        )
      })
    })
  })

  // ============================================================
  // Prescription filtering (migrating prescriptions removed from list)
  // ============================================================
  describe('migrating prescription filtering', () => {
    describe('when cutover flag is enabled', () => {
      beforeEach(() => {
        when(featureEnabled as jest.Mock)
          .calledWith('mhvMedicationsOracleHealthCutover')
          .mockReturnValue(true)
      })

      it('should filter migrating prescriptions out of the refillable list', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: migratingFacilitiesList,
          },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        // All mockData prescriptions have stationNumber '979' which matches migratingFacilitiesList
        // So filteredRefillable should be empty, showing NoRefills
        await waitFor(() =>
          expect(screen.getByRole('header', { name: t('prescriptions.noRefill.header') })).toBeTruthy(),
        )
      })

      it('should not filter prescriptions when they are not at migrating facilities', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: [
              {
                migrationDate: '2026-05-01',
                facilities: [{ facilityId: 999, facilityName: 'Other Facility' }],
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
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        // No prescriptions match facilityId 999, so all should still be in the list
        await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
        await waitFor(() => expect(screen.getByRole('header', { name: 'AMLODIPINE BESYLATE 10MG TAB' })).toBeTruthy())
      })
    })

    describe('when cutover flag is disabled', () => {
      it('should still filter migrating prescriptions from the list even when flag is off', async () => {
        // Filtering uses getMigratingPrescriptions which doesn't depend on the flag
        // The banner won't show, but filtering still applies
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            migratingFacilitiesList: migratingFacilitiesList,
          },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        // All prescriptions filtered out → NoRefills
        await waitFor(() =>
          expect(screen.getByRole('header', { name: t('prescriptions.noRefill.header') })).toBeTruthy(),
        )
      })
    })
  })

  // ============================================================
  // Prescription count header
  // ============================================================
  describe('prescription count', () => {
    it('should show correct count after filtering', async () => {
      // No migrating facilities → all prescriptions shown
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', apiParams)
        .mockResolvedValue(mock)
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByText(t('prescriptions.refill.prescriptionsCount', { count: 2 }))).toBeTruthy(),
      )
    })
  })
})

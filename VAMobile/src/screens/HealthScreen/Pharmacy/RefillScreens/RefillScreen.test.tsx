import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { PrescriptionsGetData, PrescriptionsList } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { RefillScreen } from 'screens/HealthScreen/Pharmacy/RefillScreens/RefillScreen'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'
import { featureEnabled } from 'utils/remoteConfig'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

jest.mock('utils/remoteConfig')
jest.mock('api/authorizedServices/getAuthorizedServices')
jest.mock('utils/waygateConfig', () => ({
  screenContentAllowed: jest.fn().mockReturnValue(true),
  waygateEnabled: jest.fn().mockReturnValue(true),
  getWaygate: jest.fn().mockReturnValue({
    enabled: true,
    errorMsgTitle: '',
    errorMsgBody: '',
    appUpdateButton: false,
    allowFunction: true,
    denyAccess: false,
  }),
}))

const mockUseAuthorizedServices = useAuthorizedServices as jest.Mock

context('RefillScreen', () => {
  // mockData is the original 2-item fixture: both stationNumber '979', both isRefillable: true
  // Used for base tests where all prescriptions should appear

  const migratingFacilitiesList = [
    {
      migrationDate: '2026-05-01',
      facilities: [{ facilityId: 979, facilityName: 'SLC10 TEST LAB' }],
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

  // Mix of migrating (station 979) and non-migrating (station 528) prescriptions
  // Used for tests where banner should show alongside a remaining refillable list
  const mixedFacilityMockData: PrescriptionsList = [
    {
      ...mockData[0],
      // stationNumber '979' — matches migrating facility
    },
    {
      ...mockData[1],
      id: 'non-migrating-rx',
      attributes: {
        ...mockData[1].attributes,
        stationNumber: '528',
        facilityName: 'Other VA Medical Center',
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

  const mixedFacilityMock: PrescriptionsGetData = {
    ...mock,
    data: mixedFacilityMockData,
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
    mockUseAuthorizedServices.mockReturnValue({
      data: {
        prescriptions: true,
        migratingFacilitiesList: [],
      },
    })

    when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(false)
  })

  // ============================================================
  // Base behavior (cutover flag OFF, no migrating facilities)
  // ============================================================
  describe('when there are refillable prescriptions', () => {
    beforeEach(() => {
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', apiParams)
        .mockResolvedValue(mock)
    })

    it('should show prescription info and Request Refills button', async () => {
      initializeTestInstance()

      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
      expect(screen.queryByRole('header', { name: t('prescriptions.noRefill.header') })).toBeFalsy()

      await waitFor(() =>
        expect(
          screen.getByLabelText(`${t('prescription.history.orderIdentifier', { idx: 1, total: 2 })}.`),
        ).toBeTruthy(),
      )
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
          screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle', { count: 0 }) }),
        ).toBeTruthy(),
      )
    })
  })

  describe('if there are no refillable prescriptions', () => {
    beforeEach(() => {
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', apiParams)
        .mockResolvedValue(emptyMock)
    })

    it('should show NoRefills component', async () => {
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: t('prescriptions.noRefill.header') })).toBeTruthy())
    })
  })

  describe('if no prescription is selected', () => {
    beforeEach(() => {
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', apiParams)
        .mockResolvedValue(mock)
    })

    it('should show alert for no prescription selected', async () => {
      initializeTestInstance()
      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle', { count: 0 }) }),
        ).toBeTruthy(),
      )
      fireEvent.press(
        screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle', { count: 0 }) }),
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
        when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(true)
      })

      it('should show banner and NoRefills when all refillable prescriptions are migrating', async () => {
        // Both mockData items are station 979 → all filtered out → NoRefills + banner
        mockUseAuthorizedServices.mockReturnValue({
          data: { prescriptions: true, migratingFacilitiesList: migratingFacilitiesList },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        // Banner should show so users can see which prescriptions are affected
        await waitFor(() => expect(screen.getByText(t('prescription.refill.banner.migrating.header'))).toBeTruthy())
        // NoRefills also shows since no selectable prescriptions remain
        expect(screen.getByRole('header', { name: t('prescriptions.noRefill.header') })).toBeTruthy()
      })

      it('should show banner when only some refillable prescriptions are migrating', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: { prescriptions: true, migratingFacilitiesList: migratingFacilitiesList },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mixedFacilityMock)
        initializeTestInstance()
        // Banner shows for migrating prescription
        await waitFor(() => expect(screen.getByText(t('prescription.refill.banner.migrating.header'))).toBeTruthy())
        // Non-migrating prescription still in selectable list
        await waitFor(() => expect(screen.getByRole('header', { name: 'AMLODIPINE BESYLATE 10MG TAB' })).toBeTruthy())
        // Migrating prescription is NOT in the selectable list
        expect(screen.queryByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeFalsy()
        // Count shows 1 (only non-migrating prescription)
        expect(screen.getByText(t('prescriptions.refill.prescriptionsCount', { count: 1 }))).toBeTruthy()
      })

      it('should not show banner when no prescriptions match migrating facilities', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            prescriptions: true,
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
        expect(screen.queryByText(t('prescription.refill.banner.migrating.header'))).toBeFalsy()
      })

      it('should not show banner when migratingFacilitiesList is empty', async () => {
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
        expect(screen.queryByText(t('prescription.refill.banner.migrating.header'))).toBeFalsy()
      })

      it('should not show banner when userAuthorizedServices is undefined', async () => {
        mockUseAuthorizedServices.mockReturnValue({ data: { prescriptions: true } })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
        expect(screen.queryByText(t('prescription.refill.banner.migrating.header'))).toBeFalsy()
      })
    })

    describe('when cutover flag is disabled', () => {
      it('should not show banner even when prescriptions are at migrating facilities', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: { prescriptions: true, migratingFacilitiesList: migratingFacilitiesList },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
        expect(screen.queryByText(t('prescription.refill.banner.migrating.header'))).toBeFalsy()
      })
    })
  })

  describe('migrating prescription filtering', () => {
    describe('when cutover flag is enabled', () => {
      beforeEach(() => {
        when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(true)
      })

      it('should filter migrating prescriptions out of the refillable list', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: { prescriptions: true, migratingFacilitiesList: migratingFacilitiesList },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        // Both prescriptions are station 979 → all filtered → NoRefills
        await waitFor(() =>
          expect(screen.getByRole('header', { name: t('prescriptions.noRefill.header') })).toBeTruthy(),
        )
      })

      it('should not filter prescriptions when they are not at migrating facilities', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: {
            prescriptions: true,
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
        await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
        await waitFor(() => expect(screen.getByRole('header', { name: 'AMLODIPINE BESYLATE 10MG TAB' })).toBeTruthy())
      })
    })

    describe('when cutover flag is disabled', () => {
      // Inherits the default `when` from top-level beforeEach (returns false)
      it('should not filter migrating prescriptions from the list', async () => {
        mockUseAuthorizedServices.mockReturnValue({
          data: { prescriptions: true, migratingFacilitiesList: migratingFacilitiesList },
        })
        when(api.get as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions', apiParams)
          .mockResolvedValue(mock)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
        await waitFor(() => expect(screen.getByRole('header', { name: 'AMLODIPINE BESYLATE 10MG TAB' })).toBeTruthy())
      })
    })
  })

  // ============================================================
  // Prescription count header
  // ============================================================
  describe('prescription count', () => {
    beforeEach(() => {
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', apiParams)
        .mockResolvedValue(mock)
    })

    it('should show correct count after filtering', async () => {
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
      expect(screen.queryByRole('header', { name: t('prescriptions.noRefill.header') })).toBeFalsy()
      expect(screen.getByText(t('prescriptions.refill.prescriptionsCount', { count: 2 }))).toBeTruthy()
    })
  })
})

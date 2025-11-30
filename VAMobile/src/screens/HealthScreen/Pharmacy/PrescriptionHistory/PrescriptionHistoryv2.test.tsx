import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { PrescriptionsAttributeDataV1, PrescriptionsGetData } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import PrescriptionHistory from 'screens/HealthScreen/Pharmacy/PrescriptionHistory/PrescriptionHistory'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'
import { featureEnabled } from 'utils/remoteConfig'

const mockNavigationSpy = jest.fn()

jest.mock('utils/remoteConfig')

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('api/authorizedServices/getAuthorizedServices', () => ({
  useAuthorizedServices: jest.fn(),
}))

const prescriptionDatav2: PrescriptionsGetData = {
  data: [
    {
      id: '20848812135',
      type: 'Prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'active',
        refillSubmitDate: null,
        refillDate: '2025-11-17T21:35:02.000Z',
        refillRemaining: 2,
        facilityName: 'Mann-Grandstaff Department of Veterans Affairs Medical Center',
        orderedDate: '2025-11-17T21:21:48Z',
        quantity: 18.0,
        expirationDate: '2026-11-17T07:59:59Z',
        prescriptionNumber: '20848812135',
        prescriptionName: 'albuterol (albuterol 90 mcg inhaler [18g])',
        dispensedDate: null,
        stationNumber: '668',
        isRefillable: true,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: '2 Inhalation Inhalation (breathe in) every 4 hours as needed shortness of breath or wheezing.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Active',
      } as PrescriptionsAttributeDataV1,
    },
    {
      id: '20848828719',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'expired',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 0,
        facilityName: null,
        orderedDate: '2025-11-21T15:14:35Z',
        quantity: 30.0,
        expirationDate: null,
        prescriptionNumber: '20848828719',
        prescriptionName: 'atorvastatin (atorvastatin 20 mg tablet)',
        dispensedDate: null,
        stationNumber: null,
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: '1 tabs Oral (given by mouth) every day.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Expired',
      },
    },
    {
      id: '20848772493',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'expired',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 0,
        facilityName: null,
        orderedDate: '2025-11-17T21:04:02Z',
        quantity: 100.0,
        expirationDate: null,
        prescriptionNumber: '20848772493',
        prescriptionName: 'catheter external intermed bard #33103/33303',
        dispensedDate: null,
        stationNumber: null,
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: 'Use as directed by provider..',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Expired',
      },
    },
    {
      id: '20848647925',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'active',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 2,
        facilityName: null,
        orderedDate: '2025-11-04T21:16:34Z',
        quantity: 60.0,
        expirationDate: null,
        prescriptionNumber: '20848647925',
        prescriptionName: 'celecoxib (CeleBREX 50 mg oral capsule)',
        dispensedDate: null,
        stationNumber: null,
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: '1 Capsules Oral (given by mouth) 2 times a day.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Active',
      },
    },
    {
      id: '20848813615',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'expired',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 0,
        facilityName: null,
        orderedDate: '2025-11-18T03:11:52Z',
        quantity: 21.0,
        expirationDate: null,
        prescriptionNumber: '20848813615',
        prescriptionName: 'cyclobenzaprine (cyclobenzaprine 10 mg oral tablet)',
        dispensedDate: null,
        stationNumber: null,
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: '1 tabs Oral (given by mouth) every day at bedtime.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Expired',
      },
    },
    {
      id: '20848948277',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'active',
        refillSubmitDate: null,
        refillDate: '2025-11-20T17:24:32.000Z',
        refillRemaining: 3,
        facilityName: 'Mann-Grandstaff Department of Veterans Affairs Medical Center',
        orderedDate: '2025-11-20T16:50:12Z',
        quantity: 30.0,
        expirationDate: '2026-11-20T07:59:59Z',
        prescriptionNumber: '20848948277',
        prescriptionName: 'multivitamin (multivitamin Vitamin B Complex capsule)',
        dispensedDate: null,
        stationNumber: '668',
        isRefillable: true,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: '1 Capsules Oral (given by mouth) every day.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Active',
      },
    },
    {
      id: '20848672329',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'active',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 6,
        facilityName: 'Mann-Grandstaff Department of Veterans Affairs Medical Center',
        orderedDate: '2025-11-07T20:44:26Z',
        quantity: 100.0,
        expirationDate: '2026-11-07T07:59:59Z',
        prescriptionNumber: '20848672329',
        prescriptionName: 'nitroglycerin (nitroglycerin 0.3 mg sublingual tablet [100EA])',
        dispensedDate: null,
        stationNumber: '668',
        isRefillable: true,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions:
          '1 tabs SubLingual (dissolve under the tongue) every 5 min x 3 doses as needed chest pain. If pain persists after 1 dose and 5 minutes, call 911 before repeating. May repeat dose every 5 minutes for 2 more doses.. Refills: 6.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Active',
      },
    },
    {
      id: '20848992597',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'expired',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 0,
        facilityName: 'Mann-Grandstaff Department of Veterans Affairs Medical Center',
        orderedDate: '2025-11-17T21:21:48Z',
        quantity: 20.0,
        expirationDate: '2026-11-17T07:59:59Z',
        prescriptionNumber: '20848992597',
        prescriptionName: 'predniSONE (predniSONE 20 mg tablet)',
        dispensedDate: null,
        stationNumber: '668',
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions:
          'See Instructions. Take 3 tablets by mouth every day for 3 days, then take two tablets every day for 3 days, then take one tablet every day for 3 days, then take one-half tablet every day for 3 days. Refills: 0.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Expired',
      },
    },
    {
      id: '20848863583',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'expired',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 0,
        facilityName: 'Mann-Grandstaff Department of Veterans Affairs Medical Center',
        orderedDate: '2025-11-17T21:21:48Z',
        quantity: 15.0,
        expirationDate: '2026-11-17T07:59:59Z',
        prescriptionNumber: '20848863583',
        prescriptionName: 'triamcinolone topical (triamcinolone 0.1% ointment [15g])',
        dispensedDate: null,
        stationNumber: '668',
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: '1 Application Topical (on the skin) 3 times a day. Refills: 0.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Expired',
      },
    },
    {
      id: '20849012411',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'discontinued',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 0,
        facilityName: null,
        orderedDate: '2025-11-21T20:32:59Z',
        quantity: 30.0,
        expirationDate: null,
        prescriptionNumber: '20849012411',
        prescriptionName: 'oxyCODONE (oxyCODONE 5 mg oral tablet)',
        dispensedDate: null,
        stationNumber: null,
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: '1 tabs Oral (given by mouth) every 6 hours as needed pain. Refills: 0.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Discontinued',
      },
    },
    {
      id: '20848812059',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'discontinued',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 0,
        facilityName: null,
        orderedDate: '2025-11-17T21:04:28Z',
        quantity: 20.0,
        expirationDate: null,
        prescriptionNumber: '20848812059',
        prescriptionName: 'predniSONE (predniSONE 20 mg oral tablet)',
        dispensedDate: null,
        stationNumber: null,
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions:
          'Take 3 tablets by mouth every day for 3 days, then take two tablets every day for 3 days, then take one tablet every day for 3 days, then take one-half tablet every day for 3 days. Refills: 0.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: '12 days',
        dispStatus: 'Discontinued',
      },
    },
    {
      id: '20848812057',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'discontinued',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 0,
        facilityName: null,
        orderedDate: '2025-11-17T21:03:52Z',
        quantity: 15.0,
        expirationDate: null,
        prescriptionNumber: '20848812057',
        prescriptionName: 'triamcinolone topical (triamcinolone 0.1% topical ointment)',
        dispensedDate: null,
        stationNumber: null,
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: '1 Application Topical (on the skin) 3 times a day for 14 Days. Refills: 0.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Discontinued',
      },
    },
    {
      id: '20848767133',
      type: 'prescription',
      attributes: {
        type: 'Prescription',
        refillStatus: 'discontinued',
        refillSubmitDate: null,
        refillDate: null,
        refillRemaining: 0,
        facilityName: null,
        orderedDate: '2025-11-15T01:41:51Z',
        quantity: 21.0,
        expirationDate: null,
        prescriptionNumber: '20848767133',
        prescriptionName: 'cyclobenzaprine (cyclobenzaprine 10 mg oral tablet)',
        dispensedDate: null,
        stationNumber: null,
        isRefillable: false,
        isTrackable: false,
        tracking: [],
        prescriptionSource: 'VA',
        instructions: '1 tabs Oral (given by mouth) every day at bedtime. Refills: 0.',
        facilityPhoneNumber: null,
        cmopDivisionPhone: null,
        cmopNdcNumber: null,
        remarks: null,
        dispStatus: 'Discontinued',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 7,
      totalEntries: 63,
    },
    prescriptionStatusCount: {
      active: 5,
      isRefillable: 4,
      discontinued: 10,
      inactive: 17, // Sum of discontinued + expired
      expired: 7,
      historical: 0,
      pending: 0,
      transferred: 0,
      submitted: 0,
      hold: 0,
      unknown: 0,
      total: 22,
    },
    hasNonVaMeds: false,
  },
  links: {
    self: 'https://staging-api.va.gov/mobile/v1/health/rx/prescriptions?page[size]=10&page[number]=1',
    first: 'https://staging-api.va.gov/mobile/v1/health/rx/prescriptions?page[size]=10&page[number]=1',
    prev: null,
    next: 'https://staging-api.va.gov/mobile/v1/health/rx/prescriptions?page[size]=10&page[number]=2',
    last: 'https://staging-api.va.gov/mobile/v1/health/rx/prescriptions?page[size]=10&page[number]=7',
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
      inactive: 0,
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

context('PrescriptionHistory with Oracle Health (v2)', () => {
  const mockFeatureEnabled = featureEnabled as jest.Mock
  const { useAuthorizedServices } = require('api/authorizedServices/getAuthorizedServices')

  const initializeTestInstance = (medicationsOracleHealthEnabled = true) => {
    useAuthorizedServices.mockReturnValue({
      data: {
        prescriptions: true,
        medicationsOracleHealthEnabled,
      },
    })
    render(<PrescriptionHistory {...mockNavProps()} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useAuthorizedServices.mockReturnValue({
      data: {
        prescriptions: true,
        medicationsOracleHealthEnabled: true,
      },
    })
  })

  describe('Initializes correctly with Oracle Health', () => {
    it('should show the names and instructions of prescriptions and StartRefillRequest button', async () => {
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status',
      }
      when(api.get as jest.Mock)
        .calledWith('/v1/health/rx/prescriptions', params)
        .mockResolvedValue(prescriptionDatav2)

      initializeTestInstance()

      // Use unique prescription names instead of duplicate instructions
      await waitFor(() =>
        expect(screen.getByRole('header', { name: 'albuterol (albuterol 90 mcg inhaler [18g])' })).toBeTruthy(),
      )

      // Test for a unique instruction instead of the duplicate albuterol instruction
      await waitFor(() => expect(screen.getByLabelText('1 tabs Oral (given by mouth) every day.')).toBeTruthy())

      // Test for other unique prescriptions
      await waitFor(() => expect(screen.getByLabelText('atorvastatin (atorvastatin 20 mg tablet)')).toBeTruthy())

      await waitFor(() =>
        expect(screen.getByRole('button', { name: t('prescription.history.startRefillRequest') })).toBeTruthy(),
      )
    })
  })

  describe('When there are no prescriptions', () => {
    it('should not display the refill request button', async () => {
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status', // Parameters are snake case for the back end
      }
      when(api.get as jest.Mock)
        .calledWith('/v1/health/rx/prescriptions', params)
        .mockResolvedValue(emptyMock)
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.queryByRole('button', { name: t('prescription.history.startRefillRequest') })).toBeFalsy(),
      )
    })
  })

  describe('When nonVAMedsLink feature toggle is true and user has non-VA meds', () => {
    it('should display the alert for non-VA medications', async () => {
      when(mockFeatureEnabled).calledWith('nonVAMedsLink').mockReturnValue(true)
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status', // Parameters are snake case for the back end
      }
      when(api.get as jest.Mock)
        .calledWith('/v1/health/rx/prescriptions', params)
        .mockResolvedValue({
          ...prescriptionDatav2,
          meta: {
            ...prescriptionDatav2.meta,
            hasNonVaMeds: true,
          },
        })
      initializeTestInstance()
      await waitFor(() =>
        fireEvent.press(screen.getByRole('tab', { name: t('prescription.history.nonVAMeds.header') })),
      )
      expect(screen.getByLabelText(a11yLabelVA(t('prescription.history.nonVAMeds.header')))).toBeTruthy()
      expect(
        screen.getByText(t('prescription.history.nonVAMeds.message') + t('prescription.history.nonVAMeds.link.text')),
      ).toBeTruthy()
      expect(
        screen.getByLabelText(
          a11yLabelVA(t('prescription.history.nonVAMeds.message') + t('prescription.history.nonVAMeds.link.text')),
        ),
      ).toBeTruthy()
      expect(screen.getByRole('button', { name: t('dismiss') })).toBeTruthy()
    })

    it('should open a webview that navigates to va.gov when link is clicked', async () => {
      when(mockFeatureEnabled).calledWith('nonVAMedsLink').mockReturnValue(true)
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status', // Parameters are snake case for the back end
      }
      when(api.get as jest.Mock)
        .calledWith('/v1/health/rx/prescriptions', params)
        .mockResolvedValue({
          ...prescriptionDatav2,
          meta: {
            ...prescriptionDatav2.meta,
            hasNonVaMeds: true,
          },
        })
      initializeTestInstance()
      await waitFor(() =>
        fireEvent.press(screen.getByRole('tab', { name: t('prescription.history.nonVAMeds.header') })),
      )
      fireEvent.press(screen.getByRole('link', { name: t('prescription.history.nonVAMeds.link.text') }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
        url: 'https://www.va.gov/my-health/medications',
        displayTitle: t('webview.vagov'),
        loadingMessage: t('loading.vaWebsite'),
        useSSO: true,
      })
    })

    it('should hide the alert when the dismiss button is clicked', async () => {
      when(mockFeatureEnabled).calledWith('nonVAMedsLink').mockReturnValue(true)
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status', // Parameters are snake case for the back end
      }
      when(api.get as jest.Mock)
        .calledWith('/v1/health/rx/prescriptions', params)
        .mockResolvedValue({
          ...prescriptionDatav2,
          meta: {
            ...prescriptionDatav2.meta,
            hasNonVaMeds: true,
          },
        })
      initializeTestInstance()
      await waitFor(() =>
        fireEvent.press(screen.getByRole('tab', { name: t('prescription.history.nonVAMeds.header') })),
      )
      fireEvent.press(screen.getByRole('button', { name: t('dismiss') }))
      await waitFor(() =>
        expect(screen.queryByRole('tab', { name: t('prescription.history.nonVAMeds.header') })).toBeFalsy(),
      )
    })
  })

  describe('When nonVAMedsLink feature toggle is true and user does not have non-VA meds', () => {
    it('should not display the alert for non-VA medications', async () => {
      when(mockFeatureEnabled).calledWith('nonVAMedsLink').mockReturnValue(true)
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status', // Parameters are snake case for the back end
      }
      when(api.get as jest.Mock)
        .calledWith('/v1/health/rx/prescriptions', params)
        .mockResolvedValue({
          ...prescriptionDatav2,
          meta: {
            ...prescriptionDatav2.meta,
            hasNonVaMeds: false,
          },
        })
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.queryByRole('tab', { name: t('prescription.history.nonVAMeds.header') })).toBeFalsy(),
      )
    })
  })
})

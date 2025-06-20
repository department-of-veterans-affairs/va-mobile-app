import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { PrescriptionsGetData } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'
import { featureEnabled } from 'utils/remoteConfig'

import PrescriptionHistory from './PrescriptionHistory'

const mockNavigationSpy = jest.fn()

jest.mock('utils/remoteConfig')

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const prescriptionData: PrescriptionsGetData = {
  data: [
    {
      id: '20039743',
      type: 'Prescription',
      attributes: {
        refillStatus: 'refillinprocess',
        refillSubmitDate: '2021-06-28T17:01:12.000Z',
        refillDate: '2021-07-14T04:00:00.000Z',
        refillRemaining: 9,
        facilityName: 'SLC10 TEST LAB',
        facilityPhoneNumber: '(217) 636-6712',
        orderedDate: '2021-05-25T04:00:00.000Z',
        quantity: 4,
        expirationDate: '2022-05-26T04:00:00.000Z',
        prescriptionNumber: '3636713',
        prescriptionName: 'ACETAMINOPHEN 160MG/5ML ALC-F LIQUID',
        dispensedDate: null,
        stationNumber: '979',
        isRefillable: false,
        isTrackable: false,
        instructions:
          'TAKE 1/2 TEASPOONFUL (80 MGS/2.5 MLS) EVERY SIX (6) HOURS FOR 30 DAYS NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY',
      },
    },
    {
      id: '19986250',
      type: 'Prescription',
      attributes: {
        refillStatus: 'discontinued',
        refillSubmitDate: '2021-05-24T17:42:19.000Z',
        refillDate: '2021-07-10T04:00:00.000Z',
        refillRemaining: 2,
        facilityName: 'DAYT29',
        facilityPhoneNumber: '(217) 636-6712',
        orderedDate: '2021-04-21T04:00:00.000Z',
        quantity: 10,
        expirationDate: '2022-04-22T04:00:00.000Z',
        prescriptionNumber: '2720192',
        prescriptionName: 'ACETAMINOPHEN 325MG TAB',
        dispensedDate: null,
        stationNumber: '989',
        isRefillable: false,
        isTrackable: false,
        instructions: 'TAKE ONE TABLET BY MOUTH DAILY',
      },
    },
    {
      id: '20272338',
      type: 'Prescription',
      attributes: {
        refillStatus: 'transferred',
        refillSubmitDate: '2021-10-25T14:38:35.000Z',
        refillDate: null,
        refillRemaining: 0,
        facilityName: 'SLC10 TEST LAB',
        facilityPhoneNumber: '(217) 636-6712',
        orderedDate: '2021-09-21T04:00:00.000Z',
        quantity: 1,
        expirationDate: '2021-10-21T04:00:00.000Z',
        prescriptionNumber: '3636745',
        prescriptionName: 'ACETAMINOPHEN 500MG TAB',
        dispensedDate: null,
        stationNumber: '979',
        isRefillable: false,
        isTrackable: false,
        instructions:
          'TAKE ONE TABLET EVERY SIX (6) HOURS, IF NEEDED FOR 30 DAYS NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY (8 TABLETS).',
      },
    },
    {
      id: '20004347',
      type: 'Prescription',
      attributes: {
        refillStatus: 'discontinued',
        refillSubmitDate: '2021-06-17T17:57:41.000Z',
        refillDate: '2021-07-01T04:00:00.000Z',
        refillRemaining: 0,
        facilityName: 'SLC10 TEST LAB',
        facilityPhoneNumber: '(217) 636-6712',
        orderedDate: '2021-05-08T04:00:00.000Z',
        quantity: 1,
        expirationDate: '2022-05-09T04:00:00.000Z',
        prescriptionNumber: '3636696',
        prescriptionName: 'ACETAMINOPHEN 500MG TAB',
        dispensedDate: null,
        stationNumber: '979',
        isRefillable: false,
        isTrackable: false,
        instructions:
          'TAKE ONE TABLET EVERY SIX (6) HOURS, IF NEEDED FOR 30 DAYS NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY (8 TABLETS).',
      },
    },
    {
      id: '20004343',
      type: 'Prescription',
      attributes: {
        refillStatus: 'discontinued',
        refillSubmitDate: '2021-06-17T17:57:42.000Z',
        refillDate: '2021-07-01T04:00:00.000Z',
        refillRemaining: 9,
        facilityName: 'SLC10 TEST LAB',
        facilityPhoneNumber: '(217) 636-6712',
        orderedDate: '2021-05-03T04:00:00.000Z',
        quantity: 30,
        expirationDate: '2022-05-04T04:00:00.000Z',
        prescriptionNumber: '3636692',
        prescriptionName: 'ACITRETIN 10MG CAP',
        dispensedDate: null,
        stationNumber: '979',
        isRefillable: false,
        isTrackable: false,
        instructions: 'TAKE 1G EVERY DAY FOR 30 DAYS',
      },
    },
    {
      id: '19949066',
      type: 'Prescription',
      attributes: {
        refillStatus: 'refillinprocess',
        refillSubmitDate: '2021-05-07T14:10:35.000Z',
        refillDate: '2021-05-27T04:00:00.000Z',
        refillRemaining: 10,
        facilityName: 'DAYT29',
        facilityPhoneNumber: '(217) 636-6712',
        orderedDate: '2021-05-07T04:00:00.000Z',
        quantity: 30,
        expirationDate: '2022-05-08T04:00:00.000Z',
        prescriptionNumber: '2720187',
        prescriptionName: 'ACITRETIN 25MG CAP',
        dispensedDate: null,
        stationNumber: '989',
        isRefillable: false,
        isTrackable: false,
        instructions: 'TAKE 25 BY MOUTH 1XD FOR 60 DAYS',
      },
    },
    {
      id: '20004383',
      type: 'Prescription',
      attributes: {
        refillStatus: 'refillinprocess',
        refillSubmitDate: '2021-06-02T17:11:16.000Z',
        refillDate: '2021-06-24T04:00:00.000Z',
        refillRemaining: 4,
        facilityName: 'DAYT29',
        facilityPhoneNumber: '(217) 636-6712',
        orderedDate: '2021-05-05T04:00:00.000Z',
        quantity: 6,
        expirationDate: '2022-05-06T04:00:00.000Z',
        prescriptionNumber: '2720218',
        prescriptionName: 'ACYCLOVIR 5% OINT',
        dispensedDate: null,
        stationNumber: '989',
        isRefillable: false,
        isTrackable: false,
        instructions: 'APPLY SMALL AMOUNT WEEKLY FOR 60 DAYS',
      },
    },
    {
      id: '20272340',
      type: 'Prescription',
      attributes: {
        refillStatus: 'refillinprocess',
        refillSubmitDate: '2022-05-05T18:22:15.000Z',
        refillDate: '2022-05-16T04:00:00.000Z',
        refillRemaining: 1,
        facilityName: 'SLC10 TEST LAB',
        facilityPhoneNumber: '(217) 636-6712',
        orderedDate: '2021-09-21T04:00:00.000Z',
        quantity: 30,
        expirationDate: '2022-09-22T04:00:00.000Z',
        prescriptionNumber: '3636747',
        prescriptionName: 'ADEFOVIR DIPIVOXIL 10MG TAB',
        dispensedDate: null,
        stationNumber: '979',
        isRefillable: false,
        isTrackable: false,
        instructions: 'TAKE ONE TABLET EVERY DAY FOR 30 DAYS',
      },
    },
    {
      id: '20004348',
      type: 'Prescription',
      attributes: {
        refillStatus: 'discontinued',
        refillSubmitDate: '2021-07-15T18:50:27.000Z',
        refillDate: '2021-08-04T04:00:00.000Z',
        refillRemaining: 8,
        facilityName: 'SLC10 TEST LAB',
        facilityPhoneNumber: '(217) 636-6712',
        orderedDate: '2021-05-09T04:00:00.000Z',
        quantity: 30,
        expirationDate: '2022-05-10T04:00:00.000Z',
        prescriptionNumber: '3636697',
        prescriptionName: 'ADEFOVIR DIPIVOXIL 10MG TAB',
        dispensedDate: null,
        stationNumber: '979',
        isRefillable: false,
        isTrackable: false,
        instructions: 'TAKE ONE TABLET EVERY DAY FOR 30 DAYS',
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
      active: 0,
      isRefillable: 1,
      discontinued: 0,
      expired: 0,
      historical: 0,
      pending: 0,
      transferred: 0,
      submitted: 0,
      hold: 0,
      unknown: 0,
      total: 1,
    },
    hasNonVaMeds: false,
  },
  links: {
    self: 'https://staging-api.va.gov/mobile/v0/health/rx/prescriptions?page[size]=10&page[number]=1',
    first: 'https://staging-api.va.gov/mobile/v0/health/rx/prescriptions?page[size]=10&page[number]=1',
    prev: null,
    next: 'https://staging-api.va.gov/mobile/v0/health/rx/prescriptions?page[size]=10&page[number]=2',
    last: 'https://staging-api.va.gov/mobile/v0/health/rx/prescriptions?page[size]=10&page[number]=7',
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

context('PrescriptionHistory', () => {
  const mockFeatureEnabled = featureEnabled as jest.Mock
  const initializeTestInstance = () => {
    render(<PrescriptionHistory {...mockNavProps()} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('Initializes correctly', () => {
    it('should show the names and instructions of prescriptions and StartRefillRequest button', async () => {
      const params = {
        'page[number]': '1',
        'page[size]': LARGE_PAGE_SIZE.toString(),
        sort: 'refill_status', // Parameters are snake case for the back end
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue(prescriptionData)
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByRole('header', { name: 'ACETAMINOPHEN 160MG/5ML ALC-F LIQUID' })).toBeTruthy(),
      )
      await waitFor(() =>
        expect(
          screen.getByLabelText(
            'TAKE 1/2 TEASPOONFUL (80 MGS/2.5 MLS) EVERY SIX (6) HOURS FOR 30 DAYS NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY.',
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByLabelText('ACETAMINOPHEN 325MG TAB.')).toBeTruthy())
      await waitFor(() => expect(screen.getByLabelText('TAKE ONE TABLET BY MOUTH DAILY.')).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByRole('button', { name: t('prescription.history.startRefillRequest') })).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByLabelText(t('prescription.history.transferred.title'))).toBeTruthy())
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
        .calledWith('/v0/health/rx/prescriptions', params)
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
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue({
          ...prescriptionData,
          meta: {
            ...prescriptionData.meta,
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
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue({
          ...prescriptionData,
          meta: {
            ...prescriptionData.meta,
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
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue({
          ...prescriptionData,
          meta: {
            ...prescriptionData.meta,
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
        .calledWith('/v0/health/rx/prescriptions', params)
        .mockResolvedValue({
          ...prescriptionData,
          meta: {
            ...prescriptionData.meta,
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

import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {render, context, RenderAPI, waitFor, findByTypeWithText, mockNavProps} from 'testUtils'

import PrescriptionHistory from './PrescriptionHistory'
import { ReactTestInstance } from 'react-test-renderer'

import {PrescriptionsGetData} from 'store/api'
import {initialAuthState, initialPrescriptionState, InitialState} from "../../../../store/slices";
import {TextView} from "../../../../components";

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
        orderedDate: '2021-05-25T04:00:00.000Z',
        quantity: 4,
        expirationDate: '2022-05-26T04:00:00.000Z',
        prescriptionNumber: '3636713',
        prescriptionName: 'ACETAMINOPHEN 160MG/5ML ALC-F LIQUID',
        dispensedDate: null,
        stationNumber: '979',
        isRefillable: false,
        isTrackable: false,
        instructions: 'TAKE 1/2 TEASPOONFUL (80 MGS/2.5 MLS) EVERY SIX (6) HOURS FOR 30 DAYS NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY',
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
        orderedDate: '2021-09-21T04:00:00.000Z',
        quantity: 1,
        expirationDate: '2021-10-21T04:00:00.000Z',
        prescriptionNumber: '3636745',
        prescriptionName: 'ACETAMINOPHEN 500MG TAB',
        dispensedDate: null,
        stationNumber: '979',
        isRefillable: false,
        isTrackable: false,
        instructions: 'TAKE ONE TABLET EVERY SIX (6) HOURS, IF NEEDED FOR 30 DAYS NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY (8 TABLETS).',
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
        orderedDate: '2021-05-08T04:00:00.000Z',
        quantity: 1,
        expirationDate: '2022-05-09T04:00:00.000Z',
        prescriptionNumber: '3636696',
        prescriptionName: 'ACETAMINOPHEN 500MG TAB',
        dispensedDate: null,
        stationNumber: '979',
        isRefillable: false,
        isTrackable: false,
        instructions: 'TAKE ONE TABLET EVERY SIX (6) HOURS, IF NEEDED FOR 30 DAYS NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY (8 TABLETS).',
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
  },
  links: {
    self: 'https://staging-api.va.gov/mobile/v0/health/rx/prescriptions?page[size]=10&page[number]=1',
    first: 'https://staging-api.va.gov/mobile/v0/health/rx/prescriptions?page[size]=10&page[number]=1',
    prev: null,
    next: 'https://staging-api.va.gov/mobile/v0/health/rx/prescriptions?page[size]=10&page[number]=2',
    last: 'https://staging-api.va.gov/mobile/v0/health/rx/prescriptions?page[size]=10&page[number]=7',
  },
}

context('PrescriptionHistory', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    const props = mockNavProps(undefined, undefined, { params: { } })


    component = render(<PrescriptionHistory {...props} />, { preloadedState: {
      auth: { ...initialAuthState },
        prescriptions: {
          ...initialPrescriptionState,
          prescriptions: prescriptionData.data,
          filteredPrescriptions: prescriptionData.data,
          processingPrescriptions: prescriptionData.data,
          shippedPrescriptions: prescriptionData.data,
          prescriptionPagination: prescriptionData.meta.pagination,
          prescriptionsNeedLoad: false,
          loadingHistory: false,
          tabCounts: {
            '0': 8,
            '1': 4,
            '2': 3,
          }
        },
        authorizedServices: {
          ...InitialState.authorizedServices,
          prescriptions: true,
        },
      }})
    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when showing the list', () => {
    it('should show the names and instructions of prescriptions', async () => {
      await waitFor(() => {
        initializeTestInstance()
      })

      expect(findByTypeWithText(testInstance, TextView, 'ACETAMINOPHEN 160MG/5ML ALC-F LIQUID')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'TAKE 1/2 TEASPOONFUL (80 MGS/2.5 MLS) EVERY SIX (6) HOURS FOR 30 DAYS NOT MORE THAN FOUR (4) GRAMS OF ACETAMINOPHEN PER DAY')).toBeTruthy()

      expect(findByTypeWithText(testInstance, TextView, 'ACETAMINOPHEN 325MG TAB')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'TAKE ONE TABLET BY MOUTH DAILY')).toBeTruthy()

    })
  })
})

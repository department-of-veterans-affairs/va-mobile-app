import React from 'react'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import { AppointmentAttributes, AppointmentTravelPayClaim, AppointmentType } from 'api/types'
import { AppointmentTypeConstants } from 'api/types'
import { AppointmentStatusConstants } from 'api/types'
import { render, screen } from 'testUtils'
import { AppointmentDetailsSubType } from 'utils/appointments'

import AppointmentTravelClaimDetails from './AppointmentTravelClaimDetails'

const baseAppointmentAttributes: AppointmentAttributes = {
  appointmentType: AppointmentTypeConstants.VA,
  status: AppointmentStatusConstants.BOOKED,
  bestTimeToCall: undefined,
  cancelId: '12',
  comment: 'Please arrive 20 minutes before the start of your appointment',
  friendlyLocationName: 'Johnson Clinic suite 100',
  healthcareProvider: 'Larry Bird',
  location: {
    name: 'VA Long Beach Healthcare System',
    address: {
      street: '5901 East 7th Street',
      city: 'Long Beach',
      state: 'CA',
      zipCode: '90822',
    },
    phone: {
      areaCode: '123',
      number: '456-7890',
      extension: '',
    },
    url: '',
    code: '123 code',
  },
  minutesDuration: 60,
  patientEmail: undefined,
  patientPhoneNumber: undefined,
  physicalLocation: '123 San Jacinto Ave, San Jacinto, CA 92583',
  proposedTimes: undefined,
  reason: 'Running a Fever',
  startDateUtc: '2021-02-06T19:53:14.000+00:00',
  statusDetail: null,
  timeZone: 'America/Los_Angeles',
  typeOfCare: 'General check up',
  startDateLocal: '2021-02-06T18:53:14.000-01:00',
  healthcareService: undefined,
  serviceCategoryName: null,
  practitioner: undefined,
  phoneOnly: false,
  isCovidVaccine: false,
  isPending: false,
  vetextId: '600;3210206',
}

const travelPayClaimData: AppointmentTravelPayClaim = {
  metadata: { status: 200, message: 'Data retrieved successfully.', success: true },
  claim: {
    id: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
    claimStatus: 'In Progress',
    claimNumber: 'TC0928098230498',
    appointmentDateTime: '{{now - 31 days}}',
    facilityName: 'DAYTSHR - Dayton VA Medical Center',
    createdOn: '{{now - 28 days}}',
    modifiedOn: '{{now - 28 days}}',
  },
}

const mockStartDateUtc = DateTime.utc().toISO()

type createProps = {
  startDateUtc?: AppointmentAttributes['startDateUtc']
  travelPayClaim?: AppointmentTravelPayClaim
  appointmentType: AppointmentType
}

const createTestAppointmentAttributes = ({
  startDateUtc = mockStartDateUtc,
  travelPayClaim,
  ...rest
}: createProps): AppointmentAttributes => {
  const { timeZone } = baseAppointmentAttributes
  // Convert the UTC date to the local date
  const startDateLocal = new Date(startDateUtc).toLocaleString('en-US', { timeZone })
  return { ...baseAppointmentAttributes, ...rest, startDateUtc, startDateLocal, travelPayClaim }
}

const tests = [
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
      travelPayClaim: travelPayClaimData,
    }),
    expectedResult: false,
    testName: 'Community Care',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA,
      travelPayClaim: travelPayClaimData,
    }),
    expectedResult: true,
    testName: 'In Person VA',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS,
      travelPayClaim: travelPayClaimData,
    }),
    expectedResult: true,
    testName: 'Video Atlas',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE,
      travelPayClaim: travelPayClaimData,
    }),
    expectedResult: false,
    testName: 'Video GFE',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
      travelPayClaim: travelPayClaimData,
    }),
    expectedResult: false,
    testName: 'Video Home',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE,
      travelPayClaim: travelPayClaimData,
    }),
    expectedResult: true,
    testName: 'Video On Site',
  },
]

describe('AppointmentTravelClaimDetails', () => {
  const initializeTestInstance = (subType: AppointmentDetailsSubType, travelPayClaim?: AppointmentTravelPayClaim) => {
    const attributes = {
      ...baseAppointmentAttributes,
      travelPayClaim,
    }
    render(<AppointmentTravelClaimDetails attributes={attributes} subType={subType} />)
  }

  describe('when subType is not Past', () => {
    it('should not render', () => {
      initializeTestInstance('Upcoming')
      expect(screen.queryByTestId('travelClaimDetails')).toBeNull()
      expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeNull()
    })
  })

  describe('when the subType is Past', () => {
    describe('when travel pay claim data is present', () => {
      tests.forEach((test) => {
        it(`initializes correctly when ${test.testName}`, () => {
          initializeTestInstance('Past', travelPayClaimData)
          expect(screen.getByTestId('travelClaimDetails')).toBeTruthy()
        })
      })

      it('initializes correctly', () => {
        initializeTestInstance('Past', travelPayClaimData)
        expect(screen.getByTestId('travelClaimDetails')).toBeTruthy()
        expect(
          screen.getByText(
            t('travelPay.travelClaimFiledDetails.claimNumber', {
              claimNumber: travelPayClaimData.claim!.claimNumber,
            }),
          ),
        ).toBeTruthy()
        expect(
          screen.getByText(
            t('travelPay.travelClaimFiledDetails.status', {
              status: travelPayClaimData.claim!.claimStatus,
            }),
          ),
        ).toBeTruthy()
        expect(screen.getByTestId('goToVAGovID-20d73591-ff18-4b66-9838-1429ebbf1b6e')).toBeTruthy()
        expect(screen.getByText(t('travelPay.travelClaimFiledDetails.header'))).toBeTruthy()
        expect(screen.getByText(t('travelPay.travelClaimFiledDetails.needHelp'))).toBeTruthy()
        expect(screen.getByText(t('travelPay.helpText'))).toBeTruthy()
        expect(screen.getByText(t('travelPay.phone'))).toBeTruthy()
      })

      it('should display status and link but not claim number when claim number is missing', () => {
        const modifiedData = {
          ...travelPayClaimData,
          claim: { ...travelPayClaimData.claim!, claimNumber: '' },
        }
        initializeTestInstance('Past', modifiedData)
        expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.claimNumber', { claimNumber: '' }))).toBeNull()
        expect(
          screen.getByText(
            t('travelPay.travelClaimFiledDetails.status', {
              status: travelPayClaimData.claim!.claimStatus,
            }),
          ),
        ).toBeTruthy()
        expect(screen.getByTestId('goToVAGovID-20d73591-ff18-4b66-9838-1429ebbf1b6e')).toBeTruthy()
      })
    })

    describe('when travel pay claim is not present', () => {
      it('should not render', () => {
        initializeTestInstance('Past')
        expect(screen.queryByTestId('travelClaimDetails')).toBeNull()
        expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeNull()
      })
    })
  })
})

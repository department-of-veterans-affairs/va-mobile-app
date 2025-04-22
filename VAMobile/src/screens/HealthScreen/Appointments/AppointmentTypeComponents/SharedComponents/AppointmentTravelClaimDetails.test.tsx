import React from 'react'

import { t } from 'i18next'

import { AppointmentAttributes, AppointmentTravelPayClaim } from 'api/types'
import { AppointmentTypeConstants } from 'api/types'
import { AppointmentStatusConstants } from 'api/types'
import { render, screen } from 'testUtils'

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
    claimNumber: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
    claimStatus: 'In Progress',
    id: 'TC0928098230498',
    appointmentDateTime: '{{now - 31 days}}',
    facilityName: 'DAYTSHR - Dayton VA Medical Center',
    createdOn: '{{now - 28 days}}',
    modifiedOn: '{{now - 28 days}}',
  },
}

describe('AppointmentTravelClaimDetails', () => {
  const initializeTestInstance = (travelPayClaim?: AppointmentTravelPayClaim) => {
    const attributes = {
      ...baseAppointmentAttributes,
      travelPayClaim,
    }
    render(<AppointmentTravelClaimDetails attributes={attributes} />)
  }

  describe('when travel pay claim is not present', () => {
    it('should not render', () => {
      initializeTestInstance()
      expect(screen.queryByTestId('travelClaimDetails')).toBeNull()
      expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeNull()
    })
  })

  describe('when travel pay claim is present', () => {
    it('initializes correctly', () => {
      initializeTestInstance(travelPayClaimData)
      expect(screen.getByTestId('travelClaimDetails')).toBeTruthy()
      expect(screen.getByText(t('travelPay.travelClaimFiledDetails.header'))).toBeTruthy()
      expect(screen.getByTestId('travelPayHelp')).toBeTruthy()
    })
    it('should display the travel pay claim details', () => {
      initializeTestInstance(travelPayClaimData)
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
    })
  })
})

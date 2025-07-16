import React from 'react'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import {
  AppointmentAttributes,
  AppointmentStatus,
  AppointmentStatusConstants,
  AppointmentTravelPayClaim,
  AppointmentType,
  AppointmentTypeConstants,
} from 'api/types'
import AppointmentFileTravelPayAlert from 'screens/HealthScreen/Appointments/AppointmentTypeComponents/SharedComponents/AppointmentFileTravelPayAlert'
import { context, fireEvent, render, screen } from 'testUtils'
import { defaultAppointment } from 'utils/tests/appointments'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const baseAppointmentAttributes: AppointmentAttributes = {
  appointmentType: AppointmentTypeConstants.VA,
  status: AppointmentStatusConstants.BOOKED,
  bestTimeToCall: undefined, //pending appointments
  cancelId: '12',
  comment: 'Please arrive 20 minutes before the start of your appointment',
  friendlyLocationName: 'Johnson Clinic suite 100',
  healthcareProvider: 'Larry Bird',
  location: {
    id: '123',
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
  patientEmail: undefined, // pending appointments
  patientPhoneNumber: undefined, // pending appointments
  physicalLocation: '123 San Jacinto Ave, San Jacinto, CA 92583',
  proposedTimes: undefined, // pending appointments
  reason: 'Running a Fever',
  startDateUtc: '2021-02-06T19:53:14.000+00:00',
  statusDetail: null, // canceled appointments
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
  travelPayEligible: true,
}

type createProps = {
  startDateUtc?: AppointmentAttributes['startDateUtc']
  status: AppointmentStatus
  travelPayClaim?: AppointmentTravelPayClaim
  isPending: AppointmentAttributes['isPending']
  appointmentType: AppointmentType
  phoneOnly: AppointmentAttributes['phoneOnly']
  travelPayEligible?: boolean
}

const travelPayClaimData: AppointmentTravelPayClaim = {
  metadata: { status: 200, message: 'Data retrieved successfully.', success: true },
}

const mockStartDateUtc = DateTime.utc().toISO()

const createTestAppointmentAttributes = ({
  startDateUtc = mockStartDateUtc,
  travelPayClaim,
  travelPayEligible = true,
  ...rest
}: createProps): AppointmentAttributes => {
  const { timeZone } = baseAppointmentAttributes
  // Convert the UTC date to the local date
  const startDateLocal = new Date(startDateUtc).toLocaleString('en-US', { timeZone })
  return { ...baseAppointmentAttributes, ...rest, startDateUtc, startDateLocal, travelPayClaim, travelPayEligible }
}

const claimExamAttributes = createTestAppointmentAttributes({
  status: AppointmentStatusConstants.BOOKED,
  appointmentType: AppointmentTypeConstants.VA,
  isPending: false,
  phoneOnly: false,
  travelPayClaim: travelPayClaimData,
  travelPayEligible: true,
})

const communityCareAttributes = createTestAppointmentAttributes({
  status: AppointmentStatusConstants.BOOKED,
  appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
  isPending: false,
  phoneOnly: false,
  travelPayClaim: travelPayClaimData,
  travelPayEligible: false,
})

const inPersonVAAttributes = createTestAppointmentAttributes({
  status: AppointmentStatusConstants.BOOKED,
  appointmentType: AppointmentTypeConstants.VA,
  isPending: false,
  phoneOnly: false,
  travelPayClaim: travelPayClaimData,
  travelPayEligible: true,
})

const phoneAppointmentAttributes = createTestAppointmentAttributes({
  status: AppointmentStatusConstants.BOOKED,
  appointmentType: AppointmentTypeConstants.VA,
  isPending: false,
  phoneOnly: true,
  travelPayClaim: travelPayClaimData,
  travelPayEligible: false,
})

const videoAtlasAttributes = createTestAppointmentAttributes({
  status: AppointmentStatusConstants.BOOKED,
  appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS,
  isPending: false,
  phoneOnly: false,
  travelPayClaim: travelPayClaimData,
  travelPayEligible: true,
})

const videoGFEAttributes = createTestAppointmentAttributes({
  status: AppointmentStatusConstants.BOOKED,
  appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE,
  isPending: false,
  phoneOnly: false,
  travelPayClaim: travelPayClaimData,
  travelPayEligible: false,
})

const videoHomeAttributes = createTestAppointmentAttributes({
  status: AppointmentStatusConstants.BOOKED,
  appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
  isPending: false,
  phoneOnly: false,
  travelPayClaim: travelPayClaimData,
  travelPayEligible: false,
})

const videoOnsiteAttributes = createTestAppointmentAttributes({
  status: AppointmentStatusConstants.BOOKED,
  appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE,
  isPending: false,
  phoneOnly: false,
  travelPayClaim: travelPayClaimData,
  travelPayEligible: true,
})

const tests = [
  { attributes: claimExamAttributes, expectedResult: true, testName: 'Claim Exam' },
  { attributes: communityCareAttributes, expectedResult: false, testName: 'Community Care' },
  { attributes: inPersonVAAttributes, expectedResult: true, testName: 'In Person VA' },
  { attributes: phoneAppointmentAttributes, expectedResult: false, testName: 'Phone' },
  { attributes: videoAtlasAttributes, expectedResult: true, testName: 'Video Atlas' },
  { attributes: videoGFEAttributes, expectedResult: false, testName: 'Video GFE' },
  { attributes: videoHomeAttributes, expectedResult: false, testName: 'Video Home' },
  { attributes: videoOnsiteAttributes, expectedResult: true, testName: 'Video On Site' },
]

context('AppointmentFileTravelPayAlert', () => {
  const initializeTestInstance = (attributes: AppointmentAttributes, appointmentID: string = '123') => {
    const appointment = {
      ...defaultAppointment,
      attributes,
      id: appointmentID,
    }
    render(<AppointmentFileTravelPayAlert appointment={appointment} appointmentRouteKey="key" />)
  }

  it('should initialize correctly', async () => {
    initializeTestInstance(inPersonVAAttributes)
    expect(screen.getByText(t('travelPay.fileClaimAlert.header'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.fileClaimAlert.description', { count: 29, days: 29 }))).toBeTruthy()
    expect(screen.getByText(t('travelPay.fileClaimAlert.button'))).toBeTruthy()
  })

  it('should NOT render if no more days left to file', async () => {
    const attributes = createTestAppointmentAttributes({
      status: AppointmentStatusConstants.BOOKED,
      appointmentType: AppointmentTypeConstants.VA,
      startDateUtc: DateTime.utc().minus({ days: 45 }).toISO(),
      isPending: false,
      phoneOnly: false,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: true,
    })
    initializeTestInstance(attributes)
    expect(screen.queryByTestId('appointmentFileTravelPayAlert')).toBeNull()
  })

  it('should NOT render if unable to retrieve travel pay claim data', async () => {
    const attributes = createTestAppointmentAttributes({
      status: AppointmentStatusConstants.BOOKED,
      appointmentType: AppointmentTypeConstants.VA,
      travelPayClaim: undefined,
      isPending: false,
      phoneOnly: false,
      travelPayEligible: false,
    })
    initializeTestInstance(attributes)
    expect(screen.queryByTestId('appointmentFileTravelPayAlert')).toBeNull()
  })

  it('should render if zero days left to file', async () => {
    const attributes = createTestAppointmentAttributes({
      status: AppointmentStatusConstants.BOOKED,
      appointmentType: AppointmentTypeConstants.VA,
      startDateUtc: DateTime.now().minus({ days: 30 }).toUTC().toISO(),
      isPending: false,
      phoneOnly: false,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: true,
    })
    initializeTestInstance(attributes)
    expect(screen.getByText(t('travelPay.fileClaimAlert.description', { count: 0, days: 0 }))).toBeTruthy()
    expect(screen.getByTestId('appointmentFileTravelPayAlert')).toBeTruthy()
  })

  it('should NOT render if appointment is canceled', async () => {
    const attributes = createTestAppointmentAttributes({
      status: AppointmentStatusConstants.CANCELLED,
      appointmentType: AppointmentTypeConstants.VA,
      isPending: false,
      phoneOnly: false,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: false,
    })
    initializeTestInstance(attributes)
    expect(screen.queryByTestId('appointmentFileTravelPayAlert')).toBeNull()
  })

  it('should NOT render if appointment is pending', async () => {
    const attributes = createTestAppointmentAttributes({
      status: AppointmentStatusConstants.SUBMITTED,
      appointmentType: AppointmentTypeConstants.VA,
      isPending: true,
      phoneOnly: false,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: false,
    })
    initializeTestInstance(attributes)
    expect(screen.queryByTestId('appointmentFileTravelPayAlert')).toBeNull()
  })

  it('should not render if a claim has already been filed', async () => {
    const attributes = createTestAppointmentAttributes({
      status: AppointmentStatusConstants.BOOKED,
      appointmentType: AppointmentTypeConstants.VA,
      isPending: false,
      phoneOnly: false,
      travelPayEligible: true,
      travelPayClaim: {
        ...travelPayClaimData,
        claim: {
          id: '1234',
          claimNumber: 'string',
          claimStatus: 'In Process',
          appointmentDateTime: '2024-01-01T16:45:34.465Z',
          facilityName: 'Cheyenne VA Medical Center',
          createdOn: '2024-03-22T21:22:34.465Z',
          modifiedOn: '2024-01-01T16:44:34.465Z',
        },
      },
    })
    initializeTestInstance(attributes)
    expect(screen.queryByTestId('appointmentFileTravelPayAlert')).toBeNull()
  })

  tests.forEach(({ attributes, expectedResult, testName }) => {
    it(`should ${expectedResult ? '' : 'NOT '}render for ${testName}`, async () => {
      initializeTestInstance(attributes)
      if (expectedResult) {
        expect(screen.getByTestId('appointmentFileTravelPayAlert')).toBeTruthy()
      } else {
        expect(screen.queryByTestId('appointmentFileTravelPayAlert')).toBeNull()
      }
    })
  })

  it('should navigate to the travel pay flow when the "File claim" button is clicked', async () => {
    const attributes = createTestAppointmentAttributes({
      status: AppointmentStatusConstants.BOOKED,
      appointmentType: AppointmentTypeConstants.VA,
      isPending: false,
      phoneOnly: false,
      travelPayClaim: travelPayClaimData,
    })
    initializeTestInstance(attributes, '1')
    fireEvent(screen.getByText(t('travelPay.fileClaimAlert.button')), 'press')
    expect(mockNavigationSpy).toHaveBeenCalledWith('SubmitTravelPayClaimScreen', {
      appointment: {
        ...defaultAppointment,
        attributes,
      },
      appointmentRouteKey: 'key',
    })
  })
})

import React from 'react'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import {
  AppointmentAttributes,
  AppointmentStatusConstants,
  AppointmentTravelPayClaim,
  AppointmentType,
  AppointmentTypeConstants,
} from 'api/types'
import { AppointmentTravelClaimDetails } from 'screens/HealthScreen/Appointments/AppointmentTypeComponents/SharedComponents'
import { ErrorsState } from 'store/slices'
import { RenderParams, render, screen, when } from 'testUtils'
import { AppointmentDetailsSubType } from 'utils/appointments'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')

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
    testName: 'Community Care',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA,
      travelPayClaim: travelPayClaimData,
    }),
    testName: 'In Person VA',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS,
      travelPayClaim: travelPayClaimData,
    }),
    testName: 'Video Atlas',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE,
      travelPayClaim: travelPayClaimData,
    }),
    testName: 'Video GFE',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
      travelPayClaim: travelPayClaimData,
    }),
    testName: 'Video Home',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE,
      travelPayClaim: travelPayClaimData,
    }),
    testName: 'Video On Site',
  },
]

describe('AppointmentTravelClaimDetails', () => {
  const mockFeatureEnabled = featureEnabled as jest.Mock
  const initializeTestInstance = (
    subType: AppointmentDetailsSubType,
    attributes: Partial<AppointmentAttributes> = {},
    travelPaySMOCEnabled = true,
    options?: RenderParams,
    travelPayClaimsFullHistoryEnabled = false,
  ) => {
    when(mockFeatureEnabled).calledWith('travelPaySMOC').mockReturnValue(travelPaySMOCEnabled)
    when(mockFeatureEnabled).calledWith('travelPayClaimsFullHistory').mockReturnValue(travelPayClaimsFullHistoryEnabled)
    render(
      <AppointmentTravelClaimDetails attributes={{ ...baseAppointmentAttributes, ...attributes }} subType={subType} />,
      { ...options },
    )
  }

  // describe('when travel pay is not enabled', () => {
  //   it('should not render', () => {
  //     initializeTestInstance('Past', { travelPayClaim: travelPayClaimData }, false)
  //     expect(screen.queryByTestId('travelClaimDetails')).toBeNull()
  //     expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeNull()
  //   })

  //   it('should not display a downtime alert when travel pay is in downtime', () => {
  //     const downtimeWindow = {
  //       startTime: DateTime.now(),
  //       endTime: DateTime.now().plus({ hours: 1 }),
  //     }

  //     initializeTestInstance('Past', { travelPayClaim: travelPayClaimData }, false, {
  //       preloadedState: {
  //         errors: {
  //           downtimeWindowsByFeature: {
  //             travel_pay_features: {
  //               ...downtimeWindow,
  //             },
  //           },
  //         } as ErrorsState,
  //       },
  //     })

  //     // Check that the downtime alert is not displayed
  //     expect(screen.queryByText(t('travelPay.downtime.title'))).toBeNull()
  //   })
  // })

  describe('when travel pay is enabled', () => {
    describe('when subType is not Past', () => {
      it('should not render', () => {
        initializeTestInstance('Upcoming')
        expect(screen.queryByTestId('travelClaimDetails')).toBeNull()
        expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeNull()
      })

      it('should not display a downtime alert when travel pay is in downtime', () => {
        const downtimeWindow = {
          startTime: DateTime.now(),
          endTime: DateTime.now().plus({ hours: 1 }),
        }

        initializeTestInstance('Upcoming', {}, true, {
          preloadedState: {
            errors: {
              downtimeWindowsByFeature: {
                travel_pay_features: {
                  ...downtimeWindow,
                },
              },
            } as ErrorsState,
          },
        })

        // Check that the downtime alert is not displayed
        expect(screen.queryByText(t('travelPay.downtime.title'))).toBeNull()
      })
    })

    describe('when the subType is Past', () => {
      describe('when travel pay claim data is present', () => {
        tests.forEach((test) => {
          it(`initializes correctly when ${test.testName}`, () => {
            initializeTestInstance('Past', { travelPayClaim: test.attributes.travelPayClaim })
            expect(screen.getByTestId('travelClaimDetails')).toBeTruthy()
          })
        })

        it('initializes correctly', () => {
          initializeTestInstance('Past', { travelPayClaim: travelPayClaimData })
          expect(screen.getByTestId('travelClaimDetails')).toBeTruthy()
          expect(screen.getByTestId('TextAreaSpacer')).toBeTruthy()
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
          expect(screen.getByText(t('travelPay.helpTitle'))).toBeTruthy()
          expect(screen.getByText(t('travelPay.helpText'))).toBeTruthy()
          expect(screen.getByText(displayedTextPhoneNumber(t('travelPay.phone')))).toBeTruthy()
        })

        it('should display status and link but not claim number when claim number is missing', () => {
          const modifiedData = {
            ...travelPayClaimData,
            claim: { ...travelPayClaimData.claim!, claimNumber: '' },
          }
          initializeTestInstance('Past', { travelPayClaim: modifiedData })
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
        describe('when the appointment is not past the 30 day window', () => {
          it('should not render', () => {
            const notFiledData = createTestAppointmentAttributes({
              startDateUtc: DateTime.utc().minus({ days: 28 }).toISO(),
              appointmentType: AppointmentTypeConstants.VA,
              travelPayClaim: {
                ...travelPayClaimData,
                claim: undefined,
              },
            })
            initializeTestInstance('Past', { ...notFiledData })
            expect(screen.queryByTestId('travelClaimDetails')).toBeNull()
            expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeNull()
          })
        })
        describe('when the appointment is past the 30 day window', () => {
          describe('when travel pay claims data for more than 30 days is enabled', () => {
            it('should render the no claim message when appointment meets travel pay criteria', () => {
              const missedClaimDeadlineData = createTestAppointmentAttributes({
                startDateUtc: DateTime.utc().minus({ days: 31 }).toISO(),
                appointmentType: AppointmentTypeConstants.VA,
                travelPayClaim: {
                  ...travelPayClaimData,
                  claim: undefined,
                },
              })
              initializeTestInstance('Past', { ...missedClaimDeadlineData }, true, undefined, true)
              expect(screen.getByText(t('travelPay.travelClaimFiledDetails.noClaim'))).toBeTruthy()
            })
          })

          describe('when travel pay claims data for more than 30 days is disabled', () => {
            it('should render the visit claim status page message when appointment is more than 30 days old', () => {
              const missedClaimDeadlineData = createTestAppointmentAttributes({
                startDateUtc: DateTime.utc().minus({ days: 31 }).toISO(),
                appointmentType: AppointmentTypeConstants.VA,
                travelPayClaim: {
                  ...travelPayClaimData,
                  claim: undefined,
                },
              })
              initializeTestInstance('Past', { ...missedClaimDeadlineData }, true, undefined, false)
              expect(screen.getByText(t('travelPay.travelClaimFiledDetails.visitClaimStatusPage'))).toBeTruthy()
              expect(screen.getByTestId('goToVAGovTravelClaimStatus')).toBeTruthy()
              expect(screen.getByTestId('travelPayHelp')).toBeTruthy()
            })
          })
        })

        describe('when there was an error retrieving travel claim data', () => {
          it('should render an error message when appointment is less than 30 days old', () => {
            const errorData = createTestAppointmentAttributes({
              startDateUtc: DateTime.utc().minus({ days: 28 }).toISO(),
              appointmentType: AppointmentTypeConstants.VA,
              travelPayClaim: {
                metadata: {
                  status: 500,
                  message: 'Error retrieving travel pay claim data',
                  success: false,
                },
              },
            })
            initializeTestInstance('Past', { ...errorData })
            expect(screen.queryByTestId('travelClaimDetails')).toBeTruthy()
            expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeTruthy()
            expect(screen.getByText(t('travelPay.error.general'))).toBeTruthy()
          })
          it('should render an error message when appointment is more than 30 days old', () => {
            const errorData = createTestAppointmentAttributes({
              startDateUtc: DateTime.utc().minus({ days: 31 }).toISO(),
              appointmentType: AppointmentTypeConstants.VA,
              travelPayClaim: {
                metadata: {
                  status: 500,
                  message: 'Error retrieving travel pay claim data',
                  success: false,
                },
              },
            })
            initializeTestInstance('Past', { ...errorData })
            expect(screen.queryByTestId('travelClaimDetails')).toBeTruthy()
            expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeTruthy()
            expect(screen.getByText(t('travelPay.error.general'))).toBeTruthy()
            expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.noClaim'))).toBeNull()
          })
        })
      })

      describe('when travel pay is in downtime', () => {
        const downtimeWindow = {
          startTime: DateTime.now(),
          endTime: DateTime.now().plus({ hours: 1 }),
        }

        tests.forEach((test) => {
          it(`initializes correctly when ${test.testName}`, () => {
            initializeTestInstance('Past', { travelPayClaim: test.attributes.travelPayClaim }, true, {
              preloadedState: {
                errors: {
                  downtimeWindowsByFeature: {
                    travel_pay_features: {
                      ...downtimeWindow,
                    },
                  },
                } as ErrorsState,
              },
            })
            expect(screen.getByTestId('travelClaimDetails')).toBeTruthy()
            expect(screen.getByText(t('travelPay.downtime.title'))).toBeTruthy()
            expect(
              screen.getByText(
                t('downtime.message.1', {
                  endTime: downtimeWindow.endTime.toFormat('EEEE, fff'),
                }),
              ),
            ).toBeTruthy()
          })
        })
      })
    })
  })
})

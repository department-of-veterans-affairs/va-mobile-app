import React from 'react'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import { appointmentsKeys } from 'api/appointments'
import { useMaintenanceWindows } from 'api/maintenanceWindows/getMaintenanceWindows'
import {
  AppointmentAttributes,
  AppointmentStatusConstants,
  AppointmentTravelPayClaim,
  AppointmentType,
  AppointmentTypeConstants,
  AppointmentsGetData,
} from 'api/types'
import {
  AppointmentTravelClaimDetails,
  getCachedAppointmentById,
} from 'screens/HealthScreen/Appointments/AppointmentTypeComponents/SharedComponents'
import { ErrorsState } from 'store/slices'
import { DowntimeWindowsByFeatureType } from 'store/slices'
import { QueriesData, RenderParams, fireEvent, render, screen, when } from 'testUtils'
import { AppointmentDetailsSubType } from 'utils/appointments'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { defaultAppointment } from 'utils/tests/appointments'
import { getMaintenanceWindowsPayload } from 'utils/tests/maintenanceWindows'

const { LINK_URL_TRAVEL_PAY_WEB_DETAILS } = getEnv()

jest.mock('utils/remoteConfig')

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    key: 'mocked-route-key',
    name: 'MockedScreen',
    params: {},
  }),
}))

const mockMutationState = { status: 'success' }
let mockTravelClaimSubmissionMutationState = { ...mockMutationState }
jest.mock('utils/travelPay', () => {
  const original = jest.requireActual('utils/travelPay')
  return {
    ...original,
    useTravelClaimSubmissionMutationState: () => mockTravelClaimSubmissionMutationState,
  }
})

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  return {
    ...jest.requireActual<typeof import('utils/hooks')>('utils/hooks'),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

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
  travelPayEligible: true,
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

const useMaintenanceWindowsMock = useMaintenanceWindows as jest.Mock
jest.mock('api/maintenanceWindows/getMaintenanceWindows', () => {
  return {
    useMaintenanceWindows: jest.fn().mockReturnValue({ maintenanceWindows: {} }),
  }
})

type createProps = {
  startDateUtc?: AppointmentAttributes['startDateUtc']
  travelPayClaim?: AppointmentTravelPayClaim
  appointmentType: AppointmentType
  travelPayEligible?: boolean
}

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

const tests = [
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: false,
    }),
    testName: 'Community Care',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: true,
    }),
    testName: 'In Person VA',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: true,
    }),
    testName: 'Video Atlas',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: false,
    }),
    testName: 'Video GFE',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: false,
    }),
    testName: 'Video Home',
  },
  {
    attributes: createTestAppointmentAttributes({
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE,
      travelPayClaim: travelPayClaimData,
      travelPayEligible: true,
    }),
    testName: 'Video On Site',
  },
]

describe('AppointmentTravelClaimDetails', () => {
  afterEach(() => {
    mockTravelClaimSubmissionMutationState = { ...mockMutationState }
    jest.clearAllMocks()
  })

  const mockFeatureEnabled = featureEnabled as jest.Mock
  const initializeTestInstance = (
    subType: AppointmentDetailsSubType,
    attributes: Partial<AppointmentAttributes> = {},
    travelPaySMOCEnabled = true,
    travelPayStatusListEnabled = false,
    options?: RenderParams,
    maintenanceWindows?: { maintenanceWindows: DowntimeWindowsByFeatureType },
  ) => {
    when(mockFeatureEnabled).calledWith('travelPaySMOC').mockReturnValue(travelPaySMOCEnabled)
    when(mockFeatureEnabled).calledWith('travelPayStatusList').mockReturnValue(travelPayStatusListEnabled)
    useMaintenanceWindowsMock.mockReturnValue(maintenanceWindows || getMaintenanceWindowsPayload([]))

    const fullAttributes: AppointmentAttributes = { ...baseAppointmentAttributes, ...attributes }

    if (!options) {
      // Populate react query cache with appointment data
      const mockAppointmentsGetData: AppointmentsGetData = {
        data: [{ id: 'appointmentID-123', type: 'appointment', attributes: fullAttributes }],
        meta: undefined,
      }
      const queriesData: QueriesData = [
        {
          queryKey: [appointmentsKeys.appointments],
          data: mockAppointmentsGetData,
        },
      ]

      options = {
        queriesData,
      }
    }

    return render(
      <AppointmentTravelClaimDetails
        appointmentID="appointmentID-123"
        attributes={{ ...baseAppointmentAttributes, ...attributes }}
        subType={subType}
      />,
      { ...options },
    )
  }

  describe('when travel pay is not enabled', () => {
    it('should not render', () => {
      initializeTestInstance('Past', { travelPayClaim: travelPayClaimData }, false)
      expect(screen.queryByTestId('travelClaimDetails')).toBeNull()
      expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeNull()
    })

    it('should not display a downtime alert when travel pay is in downtime', () => {
      initializeTestInstance(
        'Past',
        { travelPayClaim: travelPayClaimData },
        false,
        false,
        undefined,
        getMaintenanceWindowsPayload(['travel_pay_features']),
      )

      // Check that the downtime alert is not displayed
      expect(screen.queryByText(t('travelPay.downtime.title'))).toBeNull()
    })
  })

  describe('when travel pay is enabled', () => {
    describe('when subType is not Past', () => {
      it('should not render', () => {
        initializeTestInstance('Upcoming')
        expect(screen.queryByTestId('travelClaimDetails')).toBeNull()
        expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.header'))).toBeNull()
      })

      it('should not display a downtime alert when travel pay is in downtime', () => {
        useMaintenanceWindowsMock.mockReturnValue(getMaintenanceWindowsPayload(['travel_pay_features']))
        initializeTestInstance('Upcoming', {}, true, false, undefined)

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

        it('should display native claim details link when travelPayClaimDetails feature flag is enabled', () => {
          // Mock the travelPayClaimDetails feature flag to be enabled
          when(mockFeatureEnabled).calledWith('travelPayClaimDetails').mockReturnValue(true)

          initializeTestInstance('Past', { travelPayClaim: travelPayClaimData })

          // Should show the native claim details text and testID
          expect(screen.getByText(t('travelPay.travelClaimFiledDetails.goToClaimDetails'))).toBeTruthy()
          expect(screen.getByTestId('goToClaimDetails-20d73591-ff18-4b66-9838-1429ebbf1b6e')).toBeTruthy()

          // Should not show the VA.gov webview link
          expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.goToVAGov'))).toBeFalsy()
          expect(screen.queryByTestId('goToVAGovID-20d73591-ff18-4b66-9838-1429ebbf1b6e')).toBeFalsy()
        })

        it('should display webview link when travelPayClaimDetails feature flag is disabled', () => {
          // Mock the travelPayClaimDetails feature flag to be disabled
          when(mockFeatureEnabled).calledWith('travelPayClaimDetails').mockReturnValue(false)

          initializeTestInstance('Past', { travelPayClaim: travelPayClaimData })

          // Should show the VA.gov webview text and testID
          expect(screen.getByText(t('travelPay.travelClaimFiledDetails.goToVAGov'))).toBeTruthy()
          expect(screen.getByTestId('goToVAGovID-20d73591-ff18-4b66-9838-1429ebbf1b6e')).toBeTruthy()

          // Should not show the native claim details link
          expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.goToClaimDetails'))).toBeFalsy()
          expect(screen.queryByTestId('goToClaimDetails-20d73591-ff18-4b66-9838-1429ebbf1b6e')).toBeFalsy()
        })

        it('should navigate to native TravelPayClaimDetailsScreen when feature flag is enabled and link is clicked', () => {
          // Mock the travelPayClaimDetails feature flag to be enabled
          when(mockFeatureEnabled).calledWith('travelPayClaimDetails').mockReturnValue(true)

          initializeTestInstance('Past', { travelPayClaim: travelPayClaimData })

          const claimDetailsLink = screen.getByTestId('goToClaimDetails-20d73591-ff18-4b66-9838-1429ebbf1b6e')
          fireEvent.press(claimDetailsLink)

          // Should navigate to the native screen with correct claimId and backLabel
          expect(mockNavigationSpy).toHaveBeenCalledWith('TravelPayClaimDetailsScreen', {
            claimId: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
            backLabel: t('appointments.appointment'),
          })
        })

        it('should navigate to Webview when feature flag is disabled and link is clicked', () => {
          // Mock the travelPayClaimDetails feature flag to be disabled
          when(mockFeatureEnabled).calledWith('travelPayClaimDetails').mockReturnValue(false)

          initializeTestInstance('Past', { travelPayClaim: travelPayClaimData })

          const webviewLink = screen.getByTestId('goToVAGovID-20d73591-ff18-4b66-9838-1429ebbf1b6e')
          fireEvent.press(webviewLink)

          // Should navigate to Webview with correct URL and options
          expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
            url: expect.stringContaining('20d73591-ff18-4b66-9838-1429ebbf1b6e'),
            displayTitle: t('travelPay.webview.claims.displayTitle'),
            loadingMessage: t('travelPay.webview.claims.loading'),
            useSSO: true,
            backButtonTestID: 'webviewBack',
          })
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
          it('should render messaging and a link to still file even when past 30 days', () => {
            const missedClaimDeadlineData = createTestAppointmentAttributes({
              startDateUtc: DateTime.utc().minus({ days: 31 }).toISO(),
              appointmentType: AppointmentTypeConstants.VA,
              travelPayClaim: {
                ...travelPayClaimData,
                claim: undefined,
              },
            })
            initializeTestInstance('Past', { ...missedClaimDeadlineData }, true, undefined)
            expect(screen.getByText(t('travelPay.travelClaimFiledDetails.fileWhenNoDaysLeft'))).toBeTruthy()
            expect(screen.getByTestId('goToFileTravelClaimLink')).toBeTruthy()
          })

          it('should not render travel claim section if the appointment was ineligible', () => {
            const missedClaimDeadlineData = createTestAppointmentAttributes({
              startDateUtc: DateTime.utc().minus({ days: 31 }).toISO(),
              appointmentType: AppointmentTypeConstants.VA,
              travelPayEligible: false,
              travelPayClaim: {
                ...travelPayClaimData,
                claim: undefined,
              },
            })
            initializeTestInstance('Past', { ...missedClaimDeadlineData }, true, undefined)
            expect(screen.queryByText(t('travelPay.travelClaimFiledDetails.fileWhenNoDaysLeft'))).toBeNull()
            expect(screen.queryByTestId('goToFileTravelClaimLink')).toBeNull()
          })

          it('should navigate to filing a claim when the over 30 days file link is pressed', () => {
            const missedClaimDeadlineData = createTestAppointmentAttributes({
              startDateUtc: DateTime.utc().minus({ days: 31 }).toISO(),
              appointmentType: AppointmentTypeConstants.VA,
              travelPayClaim: {
                ...travelPayClaimData,
                claim: undefined,
              },
            })

            const mockAppointment = {
              id: 'appointmentID-123',
              type: 'appointment',
              attributes: missedClaimDeadlineData,
            }
            const mockAppointmentsGetData: AppointmentsGetData = {
              data: [{ id: 'appointmentID-123', type: 'appointment', attributes: missedClaimDeadlineData }],
              meta: undefined,
            }
            const queriesData: QueriesData = [
              {
                queryKey: [appointmentsKeys.appointments],
                data: mockAppointmentsGetData,
              },
            ]

            initializeTestInstance('Past', { ...missedClaimDeadlineData }, true, false, { queriesData })

            fireEvent.press(screen.getByTestId('goToFileTravelClaimLink'))
            expect(mockNavigationSpy).toHaveBeenCalledWith('SubmitTravelPayClaimScreen', {
              appointment: { ...mockAppointment },
              appointmentRouteKey: 'mocked-route-key',
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
            initializeTestInstance('Past', { travelPayClaim: test.attributes.travelPayClaim }, true, false, undefined, {
              maintenanceWindows: { travel_pay_features: downtimeWindow },
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

      describe('when the claim submission is in progress', () => {
        it('should render status of Submitting', () => {
          mockTravelClaimSubmissionMutationState = { status: 'pending' }
          initializeTestInstance('Past', { travelPayClaim: travelPayClaimData }, true, undefined)
          expect(
            screen.getByText(
              t('travelPay.travelClaimFiledDetails.status', {
                status: t('travelPay.travelClaimFiledDetails.status.submitting'),
              }),
            ),
          ).toBeTruthy()
          expect(screen.getByTestId('travelPayHelp')).toBeTruthy()
        })

        it('should render a web view claims list message and link when the status list FF is OFF', () => {
          mockTravelClaimSubmissionMutationState = { status: 'pending' }
          initializeTestInstance('Past', { travelPayClaim: travelPayClaimData }, true, false)
          fireEvent.press(screen.getByTestId('goToVAGovTravelClaimStatus'))

          expect(
            screen.getByText(
              t('travelPay.travelClaimFiledDetails.status', {
                status: t('travelPay.travelClaimFiledDetails.status.submitting'),
              }),
            ),
          ).toBeTruthy()
          expect(screen.getByText(t('travelPay.travelClaimFiledDetails.visitClaimStatusPage.link'))).toBeTruthy()
          expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
            url: LINK_URL_TRAVEL_PAY_WEB_DETAILS,
            displayTitle: t('travelPay.travelClaimFiledDetails.visitClaimStatusPage.displayTitle'),
            loadingMessage: t('travelPay.travelClaimFiledDetails.visitClaimStatusPage.loading'),
            useSSO: true,
          })
        })

        it('should render a link to the claims list screen when the status list FF is ON', () => {
          mockTravelClaimSubmissionMutationState = { status: 'pending' }
          initializeTestInstance('Past', { travelPayClaim: travelPayClaimData }, true, true)
          fireEvent.press(screen.getByTestId('goToVAGovTravelClaimStatus'))

          expect(screen.getByText(t('travelPay.travelClaimFiledDetails.visitNativeClaimsStatusList.link'))).toBeTruthy()
          expect(mockNavigationSpy).toHaveBeenCalledWith('BenefitsTab', { screen: 'TravelPayClaims', initial: false })
        })
      })

      it('should lookup a cached appointment by appointment id', () => {
        const mockAppointmentsQueries: AppointmentsGetData = {
          data: [
            { ...defaultAppointment, id: 'appointment-id-123' },
            { ...defaultAppointment, id: 'appointment-id-456' },
            { ...defaultAppointment, id: 'appointment-id-789' },
          ],
          meta: undefined,
        }

        const { queryClient } = initializeTestInstance('Past', { travelPayClaim: travelPayClaimData }, true, false, {
          queriesData: [
            {
              queryKey: [appointmentsKeys.appointments],
              data: mockAppointmentsQueries,
            },
          ],
        })

        const result = getCachedAppointmentById(queryClient, 'appointment-id-456')
        expect(result?.id).toBe('appointment-id-456')
      })
    })
  })
})

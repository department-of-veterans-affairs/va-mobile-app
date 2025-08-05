import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import {
  AppointmentData,
  AppointmentStatus,
  AppointmentStatusConstants,
  AppointmentType,
  AppointmentTypeConstants,
} from 'api/types'
import PastAppointmentDetails from 'screens/HealthScreen/Appointments/PastAppointments/PastAppointmentDetails'
import { context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { defaultAppointment, defaultAppointmentAttributes } from 'utils/tests/appointments'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('utils/remoteConfig')

const tests = [
  {
    description: 'renders PhoneAppointment details when appointment has phoneOnly attribute',
    appointmentType: AppointmentTypeConstants.VA,
    phoneOnly: true,
    expectedAppointmentHeaderType: t('appointments.phone.upcomingTitle'),
  },
  {
    description: 'renders InPersonVAAppointment details when appointment type is "VA"',
    appointmentType: AppointmentTypeConstants.VA,
    expectedAppointmentHeaderType: t('appointments.inPersonVA.upcomingTitle'),
  },
  {
    description: 'renders VideoAtlasAppointment details when appointment type is "VA_VIDEO_CONNECT_ATLAS"',
    appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS,
    expectedAppointmentHeaderType: t('appointments.videoAtlas.upcomingTitle'),
  },
  {
    description: 'renders VideoVAAppointment details when appointment type is "VA_VIDEO_CONNECT_ONSITE"',
    appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE,
    expectedAppointmentHeaderType: t('appointments.videoVA.upcomingTitle'),
  },
  {
    description: 'renders VideoGFEAppointment details when appointment type is "VA_VIDEO_CONNECT_GFE"',
    appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE,
    expectedAppointmentHeaderType: t('appointments.videoGFEHome.upcomingTitle'),
  },
  {
    description: 'renders ClaimExamAppointment details when the service category is "COMPENSATION & PENSION"',
    appointmentType: AppointmentTypeConstants.VA,
    serviceCategoryName: 'COMPENSATION & PENSION',
    expectedAppointmentHeaderType: t('appointments.claimExam'),
  },
  {
    description: 'renders CommunityCareAppointment details when appointment type is "COMMUNITY_CARE"',
    appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
    expectedAppointmentHeaderType: t('appointments.communityCare.upcomingTitle'),
  },
  {
    description: 'renders VideoHomeAppointment when appointment type is "VA_VIDEO_CONNECT_HOME"',
    appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
    expectedAppointmentHeaderType: t('appointments.videoGFEHome.upcomingTitle'),
  },
]

context('PastAppointmentDetails', () => {
  const appointmentData = (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    appointmentType: AppointmentType = AppointmentTypeConstants.VA,
    isPending: boolean = false,
    phoneOnly: boolean = false,
    serviceCategoryName: string | null = null,
  ): AppointmentData => ({
    ...defaultAppointment,
    attributes: {
      ...defaultAppointmentAttributes,
      healthcareService: undefined,
      serviceCategoryName,
      status,
      appointmentType,
      isPending,
      phoneOnly,
      travelPayClaim: {
        metadata: {
          status: 200,
          message: 'Data retrieved successfully',
          success: true,
        },
        claim: undefined,
      },
    },
  })

  const mockFeatureEnabled = featureEnabled as jest.Mock

  const initializeTestInstance = (paramAppointment?: AppointmentData, travelPaySMOCEnabled = false) => {
    when(mockFeatureEnabled).calledWith('travelPaySMOC').mockReturnValue(travelPaySMOCEnabled)
    const props = mockNavProps(
      {},
      {
        setOptions: jest.fn(),
        navigate: jest.fn(),
      },
      { params: { appointment: paramAppointment ? paramAppointment : appointmentData() } },
    )
    render(<PastAppointmentDetails {...props} />)
  }

  describe.each(tests)(
    '$description',
    ({ appointmentType, phoneOnly = false, serviceCategoryName = null, expectedAppointmentHeaderType }) => {
      it('not canceled or pending', () => {
        initializeTestInstance(
          appointmentData(AppointmentStatusConstants.BOOKED, appointmentType, false, phoneOnly, serviceCategoryName),
        )
        const expectedHeader = t('appointments.pastTitle', {
          appointmentType:
            expectedAppointmentHeaderType.charAt(0).toLowerCase() + expectedAppointmentHeaderType.slice(1),
        })
        expect(screen.getByRole('header', { name: expectedHeader })).toBeTruthy()
      })

      it('canceled and not pending', () => {
        initializeTestInstance(
          appointmentData(AppointmentStatusConstants.CANCELLED, appointmentType, false, phoneOnly, serviceCategoryName),
        )
        const expectedHeader = t('appointments.canceledTitle', {
          appointmentType:
            expectedAppointmentHeaderType.charAt(0).toLowerCase() + expectedAppointmentHeaderType.slice(1),
        })
        expect(screen.getByRole('header', { name: expectedHeader })).toBeTruthy()
      })

      it('pending and not canceled', () => {
        initializeTestInstance(
          appointmentData(AppointmentStatusConstants.SUBMITTED, appointmentType, true, phoneOnly, serviceCategoryName),
        )
        const expectedHeader =
          appointmentType === AppointmentTypeConstants.COMMUNITY_CARE
            ? t('appointments.request.title.communityCare')
            : t('appointments.request.title')
        expect(screen.getByRole('header', { name: expectedHeader })).toBeTruthy()
      })

      it('canceled and pending', () => {
        initializeTestInstance(
          appointmentData(AppointmentStatusConstants.CANCELLED, appointmentType, true, phoneOnly, serviceCategoryName),
        )
        const expectedHeader =
          appointmentType === AppointmentTypeConstants.COMMUNITY_CARE
            ? t('appointments.request.canceledTitle.communityCare')
            : t('appointments.request.canceledTitle')
        expect(screen.getByRole('header', { name: expectedHeader })).toBeTruthy()
      })
    },
  )
})

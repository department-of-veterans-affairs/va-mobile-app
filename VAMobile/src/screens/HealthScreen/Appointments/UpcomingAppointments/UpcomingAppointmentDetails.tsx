import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { useAppointments, useCancelAppointment } from 'api/appointments'
import { AppointmentAttributes, AppointmentData, AppointmentStatusConstants, AppointmentTypeConstants } from 'api/types'
import { ErrorComponent, FeatureLandingTemplate, LoadingComponent } from 'components'
import { Events, UserAnalytics } from 'constants/analytics'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import {
  AppointmentDetailsSubTypeConstants,
  getAppointmentAnalyticsDays,
  getAppointmentAnalyticsStatus,
  getUpcomingAppointmentDateRange,
  isAPendingAppointment,
} from 'utils/appointments'
import { registerReviewEvent } from 'utils/inAppReviews'

import { HealthStackParamList } from '../../HealthStackScreens'
import {
  ClaimExamAppointment,
  CommunityCareAppointment,
  InPersonVAAppointment,
  PhoneAppointment,
  VideoAtlasAppointment,
  VideoGFEAppointment,
  VideoHomeAppointment,
  VideoVAAppointment,
} from '../AppointmentTypeComponents'

type UpcomingAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'UpcomingAppointmentDetails'>

function UpcomingAppointmentDetails({ route, navigation }: UpcomingAppointmentDetailsProps) {
  const { appointment, vetextID } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dateRange = getUpcomingAppointmentDateRange()
  const {
    data: apptsData,
    isFetching: loadingAppointments,
    error: getApptError,
    refetch: refetchAppointments,
  } = useAppointments(dateRange.startDate, dateRange.endDate, TimeFrameTypeConstants.UPCOMING, {
    enabled: !appointment,
  })

  const { mutate: cancelAppointment, isPending: loadingAppointmentCancellation } = useCancelAppointment()

  const trueAppointment =
    appointment ||
    Object.values(apptsData?.data || []).find((appointmentData) => appointmentData.attributes.vetextId === vetextID)

  const appointmentNotFound = !!vetextID && !loadingAppointments && !trueAppointment

  const { attributes } = (trueAppointment || {}) as AppointmentData
  const { appointmentType, status, phoneOnly, serviceCategoryName } = attributes || ({} as AppointmentAttributes)
  const isAppointmentCanceled = status === AppointmentStatusConstants.CANCELLED
  const pendingAppointment = isAPendingAppointment(attributes)

  useEffect(() => {
    if (attributes) {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_appointments())
      logAnalyticsEvent(
        Events.vama_appt_view_details(
          !!pendingAppointment,
          trueAppointment?.id,
          getAppointmentAnalyticsStatus(attributes),
          attributes.appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
        ),
      )
      registerReviewEvent()
    }
  }, [trueAppointment, pendingAppointment, attributes])

  useEffect(() => {
    if (!getApptError && appointmentNotFound) {
      logAnalyticsEvent(Events.vama_appt_deep_link_fail(vetextID))
    }
  }, [appointmentNotFound, getApptError, vetextID])

  const hasError = getApptError || appointmentNotFound
  const isLoading = loadingAppointmentCancellation || loadingAppointments
  const isInPersonVAAppointment =
    appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION'
  const isPhoneAppointment = phoneOnly
  const isVideoAtlasAppointment = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS
  const isVideoVAAppointment = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE
  const isVideoGFEAppointment = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE
  const isClaimExamAppointment = serviceCategoryName === 'COMPENSATION & PENSION'
  const isCommunityCareAppointment = appointmentType === AppointmentTypeConstants.COMMUNITY_CARE
  const isVideoHomeAppointment = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME

  const subType =
    isAppointmentCanceled && pendingAppointment
      ? AppointmentDetailsSubTypeConstants.CanceledAndPending
      : isAppointmentCanceled
        ? AppointmentDetailsSubTypeConstants.Canceled
        : pendingAppointment
          ? AppointmentDetailsSubTypeConstants.Pending
          : AppointmentDetailsSubTypeConstants.Upcoming

  return (
    <FeatureLandingTemplate
      backLabel={t('appointments')}
      backLabelOnPress={navigation.goBack}
      title={t('details')}
      testID="UpcomingApptDetailsTestID"
      backLabelTestID="apptDetailsBackID">
      {isLoading ? (
        <LoadingComponent
          text={
            loadingAppointmentCancellation
              ? t('upcomingAppointmentDetails.loadingAppointmentCancellation')
              : t('appointmentDetails.loading')
          }
        />
      ) : hasError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID}
          error={getApptError}
          onTryAgain={refetchAppointments}
        />
      ) : isPhoneAppointment ? (
        <PhoneAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : isInPersonVAAppointment ? (
        <InPersonVAAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : isVideoVAAppointment ? (
        <VideoVAAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : isVideoGFEAppointment ? (
        <VideoGFEAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : isVideoAtlasAppointment ? (
        <VideoAtlasAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : isClaimExamAppointment ? (
        <ClaimExamAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : isCommunityCareAppointment ? (
        <CommunityCareAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : isVideoHomeAppointment ? (
        <VideoHomeAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : (
        <></>
      )}
    </FeatureLandingTemplate>
  )
}

export default UpcomingAppointmentDetails

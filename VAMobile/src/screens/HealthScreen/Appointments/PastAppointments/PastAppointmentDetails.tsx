import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { useAppointments } from 'api/appointments'
import { AppointmentAttributes, AppointmentData, AppointmentStatusConstants, AppointmentTypeConstants } from 'api/types'
import { FeatureLandingTemplate } from 'components'
import { Events, UserAnalytics } from 'constants/analytics'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { NAMESPACE } from 'constants/namespaces'
import {
  ClaimExamAppointment,
  CommunityCareAppointment,
  InPersonVAAppointment,
  PhoneAppointment,
  VideoAtlasAppointment,
  VideoGFEAppointment,
  VideoHomeAppointment,
  VideoVAAppointment,
} from 'screens/HealthScreen/Appointments/AppointmentTypeComponents'
import AppointmentFileTravelPayAlert from 'screens/HealthScreen/Appointments/AppointmentTypeComponents/SharedComponents/AppointmentFileTravelPayAlert'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import {
  AppointmentDetailsSubTypeConstants,
  getAppointmentAnalyticsDays,
  getAppointmentAnalyticsStatus,
  getPastAppointmentDateRange,
  isAPendingAppointment,
} from 'utils/appointments'
import { useDowntime } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { featureEnabled } from 'utils/remoteConfig'

type PastAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'PastAppointmentDetails'>

function PastAppointmentDetails({ route, navigation }: PastAppointmentDetailsProps) {
  const { appointment } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const registerReviewEvent = useReviewEvent(true)

  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, status, phoneOnly, serviceCategoryName } = attributes || ({} as AppointmentAttributes)
  const appointmentIsCanceled = status === AppointmentStatusConstants.CANCELLED
  const dateRange = getPastAppointmentDateRange()
  const pendingAppointment = isAPendingAppointment(attributes)
  const { lastUpdatedDate } = useAppointments(dateRange.startDate, dateRange.endDate, TimeFrameTypeConstants.UPCOMING, {
    enabled: !appointment,
  })
  console.log('last updated', lastUpdatedDate)
  const travelPayEnabled =
    !useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures) && featureEnabled('travelPaySMOC')

  useEffect(() => {
    if (attributes) {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_appointments())
      logAnalyticsEvent(
        Events.vama_appt_view_details(
          !!pendingAppointment,
          appointment.id,
          getAppointmentAnalyticsStatus(attributes),
          attributes.appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
        ),
      )
      registerReviewEvent()
    }
  }, [appointment, pendingAppointment, attributes, registerReviewEvent])

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
    appointmentIsCanceled && pendingAppointment
      ? AppointmentDetailsSubTypeConstants.CanceledAndPending
      : appointmentIsCanceled
        ? AppointmentDetailsSubTypeConstants.Canceled
        : pendingAppointment
          ? AppointmentDetailsSubTypeConstants.PastPending
          : AppointmentDetailsSubTypeConstants.Past

  return (
    <FeatureLandingTemplate
      testID="PastApptDetailsTestID"
      backLabel={t('appointments')}
      backLabelOnPress={navigation.goBack}
      title={t('details')}
      dataUpdatedAt={lastUpdatedDate}>
      {travelPayEnabled && <AppointmentFileTravelPayAlert appointment={appointment} appointmentRouteKey={route.key} />}
      {isPhoneAppointment ? (
        <PhoneAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isInPersonVAAppointment ? (
        <InPersonVAAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isVideoVAAppointment ? (
        <VideoVAAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isVideoGFEAppointment ? (
        <VideoGFEAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isVideoAtlasAppointment ? (
        <VideoAtlasAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isClaimExamAppointment ? (
        <ClaimExamAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isCommunityCareAppointment ? (
        <CommunityCareAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isVideoHomeAppointment ? (
        <VideoHomeAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : (
        <></>
      )}
    </FeatureLandingTemplate>
  )
}

export default PastAppointmentDetails

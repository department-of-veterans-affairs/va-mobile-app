import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { useQueryClient } from '@tanstack/react-query'

import { useAppointments } from 'api/appointments'
import { appointmentsKeys } from 'api/appointments/queryKeys'
import {
  AppointmentAttributes,
  AppointmentData,
  AppointmentStatusConstants,
  AppointmentTypeConstants,
  AvsBinariesGetData,
} from 'api/types'
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
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import {
  AppointmentDetailsSubTypeConstants,
  getAppointmentAnalyticsDays,
  getAppointmentAnalyticsStatus,
  getPastAppointmentDateRange,
  isAPendingAppointment,
} from 'utils/appointments'
import { useDowntime } from 'utils/hooks'
import { useOfflineEventQueue } from 'utils/hooks/offline'
import { useReviewEvent } from 'utils/inAppReviews'
import { featureEnabled } from 'utils/remoteConfig'

type PastAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'PastAppointmentDetails'>

function PastAppointmentDetails({ route, navigation }: PastAppointmentDetailsProps) {
  const { appointment } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const registerReviewEvent = useReviewEvent(true)
  const queryClient = useQueryClient()
  useOfflineEventQueue(ScreenIDTypesConstants.PAST_APPOINTMENT_DETAILS_SCREEN_ID)

  const { attributes } = (appointment || {}) as AppointmentData
  const avsAppointmentId = attributes?.avsPdf?.[0]?.apptId
  const cachedAvsBinaries = avsAppointmentId
    ? (queryClient.getQueryData([...appointmentsKeys.avsBinaries, avsAppointmentId]) as AvsBinariesGetData | undefined)
    : undefined
  const avsBinaryAttributes = cachedAvsBinaries?.data?.map((item) => item.attributes)
  const mergedAvsPdf = useMemo(() => {
    if (!attributes?.avsPdf?.length || !avsBinaryAttributes?.length) {
      return attributes?.avsPdf
    }

    const binariesByDocId = new Map(avsBinaryAttributes.map((binary) => [binary.docId, binary]))
    return attributes.avsPdf.map((summary) => {
      const binary = binariesByDocId.get(summary.id)
      if (!binary) {
        return summary
      }
      return {
        ...summary,
        binary: binary.binary ?? summary.binary,
        error: binary.error ?? summary.error,
      }
    })
  }, [attributes?.avsPdf, avsBinaryAttributes])
  const appointmentAttributes = useMemo(() => {
    if (!attributes || !mergedAvsPdf || mergedAvsPdf === attributes.avsPdf) {
      return attributes
    }
    return { ...attributes, avsPdf: mergedAvsPdf }
  }, [attributes, mergedAvsPdf])
  const { appointmentType, status, phoneOnly, serviceCategoryName } =
    appointmentAttributes || ({} as AppointmentAttributes)
  const appointmentIsCanceled = status === AppointmentStatusConstants.CANCELLED
  const dateRange = getPastAppointmentDateRange()
  const pendingAppointment = isAPendingAppointment(appointmentAttributes || ({} as AppointmentAttributes))
  const { lastUpdatedDate } = useAppointments(dateRange.startDate, dateRange.endDate, TimeFrameTypeConstants.UPCOMING, {
    enabled: !appointment,
  })
  const travelPayEnabled =
    !useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures) && featureEnabled('travelPaySMOC')

  useEffect(() => {
    if (appointmentAttributes) {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_appointments())
      logAnalyticsEvent(
        Events.vama_appt_view_details(
          !!pendingAppointment,
          appointment.id,
          getAppointmentAnalyticsStatus(appointmentAttributes),
          appointmentAttributes.appointmentType.toString(),
          getAppointmentAnalyticsDays(appointmentAttributes),
        ),
      )
      registerReviewEvent()
    }
  }, [appointment, pendingAppointment, appointmentAttributes, registerReviewEvent])

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
      backLabelOnPress={navigation.goBack}
      title={t('details')}
      dataUpdatedAt={lastUpdatedDate}>
      {travelPayEnabled && <AppointmentFileTravelPayAlert appointment={appointment} appointmentRouteKey={route.key} />}
      {isPhoneAppointment ? (
        <PhoneAppointment
          appointmentID={appointment.id}
          attributes={appointmentAttributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isInPersonVAAppointment ? (
        <InPersonVAAppointment
          appointmentID={appointment.id}
          attributes={appointmentAttributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isVideoVAAppointment ? (
        <VideoVAAppointment
          appointmentID={appointment.id}
          attributes={appointmentAttributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isVideoGFEAppointment ? (
        <VideoGFEAppointment
          appointmentID={appointment.id}
          attributes={appointmentAttributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isVideoAtlasAppointment ? (
        <VideoAtlasAppointment
          appointmentID={appointment.id}
          attributes={appointmentAttributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isClaimExamAppointment ? (
        <ClaimExamAppointment
          appointmentID={appointment.id}
          attributes={appointmentAttributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isCommunityCareAppointment ? (
        <CommunityCareAppointment
          appointmentID={appointment.id}
          attributes={appointmentAttributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isVideoHomeAppointment ? (
        <VideoHomeAppointment
          appointmentID={appointment.id}
          attributes={appointmentAttributes}
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

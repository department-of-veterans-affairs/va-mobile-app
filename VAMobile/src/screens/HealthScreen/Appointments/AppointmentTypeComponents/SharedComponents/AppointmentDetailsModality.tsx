import React from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { AppointmentAttributes, AppointmentStatusDetailTypeConsts } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import { getEpochSecondsOfDate } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type AppointmentDetailsModalityProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

const modalityHeader = (subType: AppointmentDetailsSubType, type: AppointmentDetailsScreenType, t: TFunction) => {
  const isCommunityCareAppointment = type === AppointmentDetailsTypeConstants.CommunityCare
  let appointmentHeaderType = ''
  switch (type) {
    case AppointmentDetailsTypeConstants.InPersonVA:
      appointmentHeaderType = t('appointments.inPersonVA.upcomingTitle')
      break
    case AppointmentDetailsTypeConstants.Phone:
      appointmentHeaderType = t('appointments.phone.upcomingTitle')
      break
    case AppointmentDetailsTypeConstants.VideoGFE:
    case AppointmentDetailsTypeConstants.VideoHome:
      appointmentHeaderType = t('appointments.videoGFEHome.upcomingTitle')
      break
    case AppointmentDetailsTypeConstants.VideoVA:
      appointmentHeaderType = t('appointments.videoVA.upcomingTitle')
      break
    case AppointmentDetailsTypeConstants.VideoAtlas:
      appointmentHeaderType = t('appointments.videoAtlas.upcomingTitle')
      break
    case AppointmentDetailsTypeConstants.ClaimExam:
      appointmentHeaderType = t('appointments.claimExam')
      break
    case AppointmentDetailsTypeConstants.CommunityCare:
      appointmentHeaderType = t('appointments.communityCare.upcomingTitle')
      break
    default:
      appointmentHeaderType = ''
  }

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
      return isCommunityCareAppointment
        ? t('appointments.request.canceledTitle.communityCare')
        : t('appointments.request.canceledTitle')
    case AppointmentDetailsSubTypeConstants.Canceled:
      return t('appointments.canceledTitle', {
        appointmentType: appointmentHeaderType.charAt(0).toLowerCase() + appointmentHeaderType.slice(1),
      })
    case AppointmentDetailsSubTypeConstants.Past:
      return t('appointments.pastTitle', {
        appointmentType: appointmentHeaderType.charAt(0).toLowerCase() + appointmentHeaderType.slice(1),
      })
    case AppointmentDetailsSubTypeConstants.Pending:
    case AppointmentDetailsSubTypeConstants.PastPending:
      return isCommunityCareAppointment
        ? t('appointments.request.title.communityCare')
        : t('appointments.request.title')
    case AppointmentDetailsSubTypeConstants.Upcoming:
      return appointmentHeaderType
  }
}

const supportingModalityBody = (
  attributes: AppointmentAttributes,
  subType: AppointmentDetailsSubType,
  type: AppointmentDetailsScreenType,
  t: TFunction,
) => {
  const { healthcareProvider, location, statusDetail, startDateUtc } = attributes
  let who = t('appointments.canceled.whoCanceled.you')
  if (
    statusDetail === AppointmentStatusDetailTypeConsts.CLINIC ||
    statusDetail === AppointmentStatusDetailTypeConsts.CLINIC_REBOOK
  ) {
    who = healthcareProvider || location?.name || t('appointments.canceled.whoCanceled.facility')
  }
  switch (subType) {
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
      return t('appointments.canceled.request', { who })
    case AppointmentDetailsSubTypeConstants.Canceled:
      return t('appointments.pending.cancelled.theTimeAndDate', { who })
    case AppointmentDetailsSubTypeConstants.Past:
      return t('appointments.pastBody')
    case AppointmentDetailsSubTypeConstants.PastPending:
    case AppointmentDetailsSubTypeConstants.Pending:
      return t('appointments.pending.body')
    case AppointmentDetailsSubTypeConstants.Upcoming:
      switch (type) {
        case AppointmentDetailsTypeConstants.InPersonVA:
          return t('appointments.inPersonVA.upcomingBody', {
            facilityName: location?.name || t('prescription.details.vaFacilityHeader'),
          })
        case AppointmentDetailsTypeConstants.Phone:
          return t('appointments.phone.upcomingBody')
        case AppointmentDetailsTypeConstants.VideoGFE:
          return t('appointments.videoGFE.upcomingBody')
        case AppointmentDetailsTypeConstants.VideoVA:
          return t('appointments.videoVA.upcomingBody')
        case AppointmentDetailsTypeConstants.VideoAtlas:
          return t('appointments.videoAtlas.upcomingBody', { code: location.code || '' })
        case AppointmentDetailsTypeConstants.ClaimExam:
          return t('appointments.claimExam.explanationText')
        case AppointmentDetailsTypeConstants.CommunityCare:
          return t('appointments.communityCare.upcomingBody')
        case AppointmentDetailsTypeConstants.VideoHome:
          const thirtyMinuteFutureDateSeconds = DateTime.now().toUTC().toSeconds() + 1800 // 30 minutes
          const startDateSeconds = getEpochSecondsOfDate(startDateUtc)
          if (thirtyMinuteFutureDateSeconds >= startDateSeconds) {
            return t('appointments.videoHome.timeToJoin.upcomingBody')
          }
          return t('appointments.videoHome.tooEarly.upcomingBody')
        default:
          return ''
      }
  }
}

function AppointmentDetailsModality({ attributes, subType, type }: AppointmentDetailsModalityProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const heading = modalityHeader(subType, type, t)
  const body = supportingModalityBody(attributes, subType, type, t)

  return (
    <Box>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView variant="MobileBodyBold" accessibilityRole="header" accessibilityLabel={a11yLabelVA(heading || '')}>
        {heading}
      </TextView>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView
        variant="MobileBody"
        paragraphSpacing={
          subType === AppointmentDetailsSubTypeConstants.Pending ||
          subType === AppointmentDetailsSubTypeConstants.PastPending
            ? true
            : undefined
        }
        mb={
          subType === AppointmentDetailsSubTypeConstants.Pending ||
          subType === AppointmentDetailsSubTypeConstants.PastPending
            ? undefined
            : theme.dimensions.standardMarginBetween
        }
        accessibilityLabel={a11yLabelVA(body || '')}>
        {body}
      </TextView>
    </Box>
  )
}

export default AppointmentDetailsModality

import React from 'react'
import { useTranslation } from 'react-i18next'

import { useContactInformation } from 'api/contactInformation'
import { AppointmentAttributes, AppointmentLocation } from 'api/types'
import { Box } from 'components'
import ClickForActionLinkDeprecated, {
  ActionLinkMetaData,
  LinkTypeOptionsConstants,
} from 'components/ClickForActionLinkDeprecated'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
  getAppointmentAnalyticsDays,
  getAppointmentAnalyticsStatus,
} from 'utils/appointments'
import { getEpochSecondsOfDate } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'

type DEPRECATED_AppointmentCalendarButtonProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

function DEPRECATED_AppointmentCalendarButton({
  appointmentID,
  attributes,
  subType,
  type,
}: DEPRECATED_AppointmentCalendarButtonProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { location, minutesDuration, startDateUtc } = attributes || ({} as AppointmentAttributes)
  const { address, lat, long, name } = location || ({} as AppointmentLocation)
  const { data: contactInformation } = useContactInformation()

  const getLocation = (): string => {
    switch (type) {
      case AppointmentDetailsTypeConstants.InPersonVA:
      case AppointmentDetailsTypeConstants.VideoAtlas:
      case AppointmentDetailsTypeConstants.VideoVA:
      case AppointmentDetailsTypeConstants.ClaimExam:
      case AppointmentDetailsTypeConstants.CommunityCare:
        if (isIOS() && lat && long) {
          return name || ''
        } else if (address?.street && address?.city && address?.state && address?.zipCode) {
          return `${address.street} ${address.city}, ${address.state} ${address.zipCode}`
        } else {
          return name || ''
        }
      case AppointmentDetailsTypeConstants.VideoGFE:
      case AppointmentDetailsTypeConstants.Phone:
      case AppointmentDetailsTypeConstants.VideoHome:
        if (contactInformation?.residentialAddress) {
          return `${contactInformation.residentialAddress.addressLine1} ${contactInformation.residentialAddress.city}, ${contactInformation.residentialAddress.province || contactInformation.residentialAddress.stateCode} ${contactInformation.residentialAddress.internationalPostalCode || contactInformation.residentialAddress.zipCode}`
        } else {
          return ''
        }
      default:
        return ''
    }
  }

  const getCalendarTitle = () => {
    switch (type) {
      case AppointmentDetailsTypeConstants.InPersonVA:
        return t('upcomingAppointments.vaAppointment')
      case AppointmentDetailsTypeConstants.Phone:
        return t('appointments.phone.upcomingTitle')
      case AppointmentDetailsTypeConstants.VideoAtlas:
        return t('upcomingAppointments.connectAtAtlas')
      case AppointmentDetailsTypeConstants.VideoGFE:
        return t('upcomingAppointments.connectGFE')
      case AppointmentDetailsTypeConstants.VideoVA:
        return t('upcomingAppointments.connectOnsite')
      case AppointmentDetailsTypeConstants.ClaimExam:
        return t('upcomingAppointments.vaAppointmentClaimExam')
      case AppointmentDetailsTypeConstants.CommunityCare:
        return t('upcomingAppointments.communityCare')
      case AppointmentDetailsTypeConstants.VideoHome:
        return t('upcomingAppointments.connectAtHome')
      default:
        return ''
    }
  }

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.Upcoming:
      const startTimeDate = startDateUtc ? new Date(startDateUtc) : new Date()
      const endTime = minutesDuration
        ? new Date(startTimeDate.setMinutes(startTimeDate.getMinutes() + minutesDuration)).toISOString()
        : startTimeDate.toISOString()

      const title = getCalendarTitle()
      const startSeconds = getEpochSecondsOfDate(startDateUtc)
      const endSeconds = getEpochSecondsOfDate(endTime)
      const metaData: ActionLinkMetaData = {
        title,
        startTime: startSeconds,
        endTime: endSeconds,
        location: getLocation(),
        latitude: lat || 0,
        longitude: long || 0,
      }
      const analytic = () => {
        logAnalyticsEvent(
          Events.vama_apt_add_cal(
            appointmentID,
            getAppointmentAnalyticsStatus(attributes),
            attributes.appointmentType.toString(),
            getAppointmentAnalyticsDays(attributes),
          ),
        )
      }

      return (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <ClickForActionLinkDeprecated
            displayedText={t('upcomingAppointments.addToCalendar')}
            linkType={LinkTypeOptionsConstants.calendar}
            metaData={metaData}
            fireAnalytic={analytic}
            a11yLabel={t('upcomingAppointments.addToCalendar')}
            testID="addToCalendarTestID"
          />
        </Box>
      )
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
    case AppointmentDetailsSubTypeConstants.Pending:
    case AppointmentDetailsSubTypeConstants.Canceled:
    case AppointmentDetailsSubTypeConstants.Past:
    case AppointmentDetailsSubTypeConstants.Upcoming:
    case AppointmentDetailsSubTypeConstants.PastPending:
    default:
      return <></>
  }
}

export default DEPRECATED_AppointmentCalendarButton

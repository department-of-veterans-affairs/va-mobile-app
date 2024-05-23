import React from 'react'
import { useTranslation } from 'react-i18next'

import { useQueryClient } from '@tanstack/react-query'

import { contactInformationKeys } from 'api/contactInformation'
import { AppointmentAttributes, AppointmentLocation, UserContactInformation } from 'api/types'
import { Box, LinkWithAnalytics } from 'components'
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
import { addToCalendar, checkCalendarPermission, requestCalendarPermission } from 'utils/rnCalendar'

type AppointmentCalendarButtonProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

function AppointmentCalendarButton({ appointmentID, attributes, subType, type }: AppointmentCalendarButtonProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { location, minutesDuration, startDateUtc } = attributes || ({} as AppointmentAttributes)
  const { address, lat, long, name } = location || ({} as AppointmentLocation)
  const queryClient = useQueryClient()

  const getLocation = (): string => {
    switch (type) {
      case AppointmentDetailsTypeConstants.InPersonVA:
        if (isIOS() && lat && long) {
          return name || ''
        } else if (address?.street && address?.city && address?.state && address?.zipCode) {
          return `${address.street} ${address.city}, ${address.state} ${address.zipCode}`
        } else {
          return name || ''
        }
      case AppointmentDetailsTypeConstants.Phone:
        const userContactInfo = queryClient.getQueryData(
          contactInformationKeys.contactInformation,
        ) as UserContactInformation
        if (userContactInfo.residentialAddress) {
          return `${userContactInfo.residentialAddress.addressLine1} ${userContactInfo.residentialAddress.city}, ${userContactInfo.residentialAddress.province || userContactInfo.residentialAddress.stateCode} ${userContactInfo.residentialAddress.internationalPostalCode || userContactInfo.residentialAddress.zipCode}`
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
      default:
        return ''
    }
    //[AppointmentTypeConstants.COMMUNITY_CARE]: 'upcomingAppointments.communityCare',
    //   [AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS]: 'upcomingAppointments.connectAtAtlas',
    //   [AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME]: 'upcomingAppointments.connectAtHome',
    //   [AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE]: 'upcomingAppointments.connectOnsite',
    //   [AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE]: 'upcomingAppointments.connectGFE',
  }

  const calendarOnPress = async () => {
    logAnalyticsEvent(
      Events.vama_apt_add_cal(
        appointmentID,
        getAppointmentAnalyticsStatus(attributes),
        attributes.appointmentType.toString(),
        getAppointmentAnalyticsDays(attributes),
      ),
    )

    const startTimeDate = startDateUtc ? new Date(startDateUtc) : new Date()
    const endTime = minutesDuration
      ? new Date(startTimeDate.setMinutes(startTimeDate.getMinutes() + minutesDuration)).toISOString()
      : startTimeDate.toISOString()

    const title = getCalendarTitle()
    const startSeconds = getEpochSecondsOfDate(startDateUtc)
    const endSeconds = getEpochSecondsOfDate(endTime)

    let hasPermission = await checkCalendarPermission()
    if (!hasPermission) {
      hasPermission = await requestCalendarPermission()
    }

    if (hasPermission) {
      await addToCalendar(title, startSeconds, endSeconds, getLocation(), lat || 0, long || 0)
    }
  }

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.Upcoming:
      return (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics
            type="calendar"
            text={t('upcomingAppointments.addToCalendar')}
            a11yLabel={t('upcomingAppointments.addToCalendar')}
            a11yHint={t('upcomingAppointmentDetails.addToCalendarA11yHint')}
            onPress={calendarOnPress}
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

export default AppointmentCalendarButton

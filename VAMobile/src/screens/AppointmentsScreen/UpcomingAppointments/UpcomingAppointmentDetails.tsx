import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC } from 'react'

import { AppointmentTypeToID } from 'store/api/types'
import { AppointmentsStackParamList } from '../AppointmentsScreen'
import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, LinkUrlIconType, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { getEpochSecondsOfDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_SCHEDULE_APPOINTMENTS } = getEnv()

type UpcomingAppointmentDetailsProps = StackScreenProps<AppointmentsStackParamList, 'UpcomingAppointmentDetails'>

const UpcomingAppointmentDetails: FC<UpcomingAppointmentDetailsProps> = ({ route }) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const { appointmentType, calendarData, healthcareService, location } = route.params
  const { title, startTime, minutesDuration, locationName, timeZone } = calendarData
  const { name, address, phone } = location

  const startTimeDate = new Date(startTime)
  const endTime = new Date(startTimeDate.setMinutes(startTimeDate.getMinutes() + minutesDuration)).toISOString()
  const addToCalendarProps: LinkButtonProps = {
    displayedText: t('upcomingAppointments.addToCalendar'),
    linkType: LinkTypeOptionsConstants.calendar,
    metaData: {
      title,
      startTime: getEpochSecondsOfDate(startTime),
      endTime: getEpochSecondsOfDate(endTime),
      location: locationName,
    },
  }

  const cityStateZip = address ? `${address.city}, ${address.state} ${address.zipCode}` : ''

  const numberOrUrlLink = phone ? phone.number.replace(/\D/g, '') : ''
  const clickToCallProps: LinkButtonProps = {
    displayedText: phone?.number || '',
    linkType: LinkTypeOptionsConstants.call,
    numberOrUrlLink,
  }

  const clickToCallClinic = phone ? (
    <Box mt={theme.dimensions.marginBetween}>
      <ClickForActionLink {...clickToCallProps} {...a11yHintProp(t('upcomingAppointmentDetails.callNumberA11yHint'))} />
    </Box>
  ) : (
    <></>
  )

  const visitVAGovProps: LinkButtonProps = {
    displayedText: t('upcomingAppointmentDetails.visitVAGov'),
    linkType: LinkTypeOptionsConstants.url,
    linkUrlIconType: LinkUrlIconType.Arrow,
    numberOrUrlLink: LINK_URL_SCHEDULE_APPOINTMENTS,
  }

  return (
    <ScrollView {...testIdProps('Upcoming-appointment-details')}>
      <TextArea>
        <TextView variant="MobileBody" mb={theme.dimensions.marginBetween}>
          {t(AppointmentTypeToID[appointmentType])}
        </TextView>
        <TextView variant="BitterBoldHeading" accessibilityRole="header">
          {getFormattedDateWithWeekdayForTimeZone(startTime, timeZone)}
        </TextView>
        <TextView variant="BitterBoldHeading" mb={theme.dimensions.marginBetween} accessibilityRole="header">
          {getFormattedTimeForTimeZone(startTime, timeZone)}
        </TextView>
        <Box mb={theme.dimensions.marginBetween}>
          <ClickForActionLink {...addToCalendarProps} {...a11yHintProp(t('upcomingAppointmentDetails.addToCalendarA11yHint'))} />
        </Box>

        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {healthcareService}
        </TextView>
        <TextView variant="MobileBody">{name}</TextView>
        {!!address && <TextView variant="MobileBody">{address.line1}</TextView>}
        {!!address && !!address.line2 && <TextView variant="MobileBody">{address.line2}</TextView>}
        {!!address && !!address.line3 && <TextView variant="MobileBody">{address.line3}</TextView>}
        {!!cityStateZip && <TextView variant="MobileBody">{cityStateZip}</TextView>}

        <TextView mt={theme.dimensions.marginBetween} color="link" textDecoration="underline">
          GET DIRECTIONS
        </TextView>

        {clickToCallClinic}
      </TextArea>

      <Box mt={theme.dimensions.marginBetween}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.needToCancel')}
          </TextView>
          <TextView variant="MobileBody">{t('upcomingAppointmentDetails.toCancelThisAppointment')}</TextView>
          <Box mt={theme.dimensions.marginBetween}>
            <ClickForActionLink {...visitVAGovProps} />
          </Box>
          {clickToCallClinic}
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default UpcomingAppointmentDetails

import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect } from 'react'

import { AppointmentAttributes, AppointmentData, AppointmentLocation, AppointmentTypeConstants, AppointmentTypeToID } from 'store/api/types'
import { AppointmentsStackParamList } from '../AppointmentsScreen'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, LinkUrlIconType, TextArea, TextView, VAButton, VAButtonProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { getAllFieldsThatExist } from 'utils/common'
import { getAppointment } from 'store/actions'
import { getEpochSecondsOfDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone, getNumbersFromString } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_SCHEDULE_APPOINTMENTS } = getEnv()

type UpcomingAppointmentDetailsProps = StackScreenProps<AppointmentsStackParamList, 'UpcomingAppointmentDetails'>

const UpcomingAppointmentDetails: FC<UpcomingAppointmentDetailsProps> = ({ route }) => {
  const { appointmentID } = route.params

  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { appointment } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  const { attributes } = appointment as AppointmentData
  const { appointmentType, healthcareService, location, startTime, minutesDuration, timeZone, comment, practitioner } = attributes || ({} as AppointmentAttributes)
  const { name, address, phone, code } = location || ({} as AppointmentLocation)

  useEffect(() => {
    dispatch(getAppointment(appointmentID))
  }, [dispatch, appointmentID])

  const startTimeDate = startTime ? new Date(startTime) : new Date()
  const endTime = startTime && minutesDuration ? new Date(startTimeDate.setMinutes(startTimeDate.getMinutes() + minutesDuration)).toISOString() : ''
  const addToCalendarProps: LinkButtonProps = {
    displayedText: t('upcomingAppointments.addToCalendar'),
    linkType: LinkTypeOptionsConstants.calendar,
    metaData: {
      title: t(AppointmentTypeToID[appointmentType]),
      startTime: getEpochSecondsOfDate(startTime),
      endTime: getEpochSecondsOfDate(endTime),
      location: name,
    },
  }

  const cityStateZip = address ? `${address.city}, ${address.state} ${address.zipCode}` : ''

  const visitVAGovProps: LinkButtonProps = {
    displayedText: t('upcomingAppointmentDetails.visitVAGov'),
    linkType: LinkTypeOptionsConstants.url,
    linkUrlIconType: LinkUrlIconType.Arrow,
    numberOrUrlLink: LINK_URL_SCHEDULE_APPOINTMENTS,
  }

  const ClickToCallClinic = (): ReactElement => {
    const numberOrUrlLink = phone ? getNumbersFromString(phone.number) : ''
    const clickToCallProps: LinkButtonProps = {
      displayedText: phone?.number || '',
      linkType: LinkTypeOptionsConstants.call,
      numberOrUrlLink,
    }

    if (phone) {
      return (
        <Box mt={theme.dimensions.marginBetween}>
          <ClickForActionLink {...clickToCallProps} {...a11yHintProp(t('upcomingAppointmentDetails.callNumberA11yHint'))} />
        </Box>
      )
    }

    return <></>
  }

  const VA_VALocation_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.VA || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE) {
      return (
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {healthcareService}
        </TextView>
      )
    }

    return <></>
  }

  const CommunityCare_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE) {
      return (
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.specialInstructions')}
          </TextView>
          <TextView variant="MobileBody">{comment}</TextView>
        </Box>
      )
    }

    return <></>
  }

  const VALocation_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE && !!practitioner) {
      const practitionerName = getAllFieldsThatExist([practitioner.firstName, practitioner.middleName, practitioner.lastName]).join(' ').trim()

      return (
        <Box mb={theme.dimensions.marginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.provider')}
          </TextView>
          <TextView variant="MobileBody">{practitionerName}</TextView>
        </Box>
      )
    }

    return <></>
  }

  const getVideoInstructionsTranslationID = (): string => {
    switch (appointmentType) {
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
        return 'upcomingAppointmentDetails.howToJoinInstructionsVALocation'
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
        return 'upcomingAppointmentDetails.howToJoinInstructionsVADevice'
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
        return 'upcomingAppointmentDetails.howToJoinInstructionsAtlas'
      default:
        return ''
    }
  }

  const VideoAppointment_HowToJoin = (): ReactElement => {
    const isVideoAppt =
      appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS ||
      appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE ||
      appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE

    if (isVideoAppt) {
      return (
        <Box mb={theme.dimensions.marginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.howToJoin')}
          </TextView>
          <TextView variant="MobileBody">{t(getVideoInstructionsTranslationID())}</TextView>
        </Box>
      )
    }

    return <></>
  }

  const VAVCAtHome_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME) {
      const onPrepareForVideoVisit = navigateTo('PrepareForVideoVisit')

      const joinSessionOnPress = (): void => {}

      const joinSessionButtonProps: VAButtonProps = {
        label: t('upcomingAppointmentDetails.joinSession'),
        testID: t('upcomingAppointmentDetails.joinSession'),
        textColor: 'primaryContrast',
        backgroundColor: 'button',
        onPress: joinSessionOnPress,
      }

      return (
        <Box mb={theme.dimensions.marginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.howToJoinVirtualSession')}
          </TextView>
          <TextView variant="MobileBody">{t('upcomingAppointmentDetails.howToJoinInstructionsVAAtHome')}</TextView>

          <VAButton {...joinSessionButtonProps} />

          <TextView variant="MobileBodyLink" color="link" onPress={onPrepareForVideoVisit} {...testIdProps(t('upcomingAppointmentDetails.prepareForVideoVisit'))}>
            {t('upcomingAppointmentDetails.prepareForVideoVisit')}
          </TextView>
        </Box>
      )
    }

    return <></>
  }

  const isVAOrCCOrVALocation =
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE ||
    appointmentType === AppointmentTypeConstants.COMMUNITY_CARE ||
    appointmentType === AppointmentTypeConstants.VA

  const VA_CC_VALocation_Atlas_AddressAndNumberData = (): ReactElement => {
    const appointmentIsAtlas = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS
    if (isVAOrCCOrVALocation || appointmentIsAtlas) {
      return (
        <Box>
          <VA_VALocation_AppointmentData />
          {!appointmentIsAtlas && <TextView variant="MobileBody">{name}</TextView>}
          {!!address && <TextView variant="MobileBody">{address.line1}</TextView>}
          {!!address && !!address.line2 && <TextView variant="MobileBody">{address.line2}</TextView>}
          {!!address && !!address.line3 && <TextView variant="MobileBody">{address.line3}</TextView>}
          {!!cityStateZip && <TextView variant="MobileBody">{cityStateZip}</TextView>}

          {/*TODO: Replace placeholder with get directions click for action link */}
          <TextView mt={theme.dimensions.marginBetween} color="link" textDecoration="underline">
            GET DIRECTIONS
          </TextView>

          {!appointmentIsAtlas && <ClickToCallClinic />}
        </Box>
      )
    }

    return <></>
  }

  const Atlas_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS) {
      return (
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.appointmentCode', { code: code || '' })}
          </TextView>
          <TextView variant="MobileBody">{t('upcomingAppointmentDetails.useCode')}</TextView>
        </Box>
      )
    }

    return <></>
  }

  return (
    <ScrollView {...testIdProps('Upcoming-appointment-details')}>
      <Box mt={theme.dimensions.marginBetween}>
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

          <VideoAppointment_HowToJoin />

          <VAVCAtHome_AppointmentData />

          <VALocation_AppointmentData />

          <VA_CC_VALocation_Atlas_AddressAndNumberData />

          <Atlas_AppointmentData />

          <CommunityCare_AppointmentData />
        </TextArea>

        <Box my={theme.dimensions.marginBetween}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('upcomingAppointmentDetails.needToCancel')}
            </TextView>
            <TextView variant="MobileBody">{t('upcomingAppointmentDetails.toCancelThisAppointment')}</TextView>
            <Box mt={theme.dimensions.marginBetween}>
              <ClickForActionLink {...visitVAGovProps} />
            </Box>
            {isVAOrCCOrVALocation && <ClickToCallClinic />}
          </TextArea>
        </Box>
      </Box>
    </ScrollView>
  )
}

export default UpcomingAppointmentDetails

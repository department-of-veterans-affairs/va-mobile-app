import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect } from 'react'

import { AppointmentAttributes, AppointmentData, AppointmentLocation, AppointmentStatusConstants, AppointmentTypeConstants, AppointmentTypeToID } from 'store/api/types'
import { AppointmentsStackParamList } from '../AppointmentsScreen'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, LinkUrlIconType, TextArea, TextView, VAButton, VAButtonProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { getAppointment } from 'store/actions'
import { getEpochSecondsOfDate } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AppointmentAddressAndNumber, { isVAOrCCOrVALocation } from '../AppointmentDetailsCommon/AppointmentAddressAndNumber'
import AppointmentTypeAndDate from '../AppointmentDetailsCommon/AppointmentTypeAndDate'
import ClickToCallClinic from '../AppointmentDetailsCommon/ClickToCallClinic'
import ProviderName from '../AppointmentDetailsCommon/ProviderName'
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
  const { appointmentType, healthcareService, location, startTime, minutesDuration, timeZone, comment, practitioner, status } = attributes || ({} as AppointmentAttributes)
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

  const visitVAGovProps: LinkButtonProps = {
    displayedText: t('upcomingAppointmentDetails.visitVAGov'),
    linkType: LinkTypeOptionsConstants.url,
    linkUrlIconType: LinkUrlIconType.Arrow,
    numberOrUrlLink: LINK_URL_SCHEDULE_APPOINTMENTS,
  }

  const CommunityCare_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE && status !== AppointmentStatusConstants.CANCELLED) {
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
    const isGFE = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE
    const isVideoAppt = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE || isGFE

    if (isVideoAppt) {
      return (
        <Box mb={isGFE ? 0 : theme.dimensions.marginBetween}>
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
        <Box>
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

  const AddToCalendar = (): ReactElement => {
    if (status !== AppointmentStatusConstants.CANCELLED) {
      return (
        <Box my={theme.dimensions.marginBetween}>
          <ClickForActionLink {...addToCalendarProps} {...a11yHintProp(t('upcomingAppointmentDetails.addToCalendarA11yHint'))} />
        </Box>
      )
    }

    return <Box mb={theme.dimensions.marginBetween} />
  }

  const ScheduleAppointmentOrNeedToCancel = (): ReactElement => {
    if (status !== AppointmentStatusConstants.CANCELLED) {
      return (
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.needToCancel')}
          </TextView>
          <TextView variant="MobileBody">{t('upcomingAppointmentDetails.toCancelThisAppointment')}</TextView>
          <Box mt={theme.dimensions.marginBetween}>
            <ClickForActionLink {...visitVAGovProps} />
          </Box>
          {isVAOrCCOrVALocation(appointmentType) && <ClickToCallClinic phone={phone} />}
        </TextArea>
      )
    }

    return (
      <TextArea>
        <TextView variant="MobileBody">{t('pastAppointmentDetails.toScheduleAnotherAppointment')}</TextView>
      </TextArea>
    )
  }

  return (
    <ScrollView {...testIdProps('Upcoming-appointment-details')}>
      <Box mt={theme.dimensions.marginBetween}>
        <TextArea>
          <AppointmentTypeAndDate timeZone={timeZone} startTime={startTime} appointmentType={appointmentType} status={status} />

          <AddToCalendar />

          <VideoAppointment_HowToJoin />

          <VAVCAtHome_AppointmentData />

          <ProviderName appointmentType={appointmentType} practitioner={practitioner} />

          <AppointmentAddressAndNumber appointmentType={appointmentType} healthcareService={healthcareService} address={address} locationName={name} phone={phone} />

          <Atlas_AppointmentData />

          <CommunityCare_AppointmentData />
        </TextArea>

        <Box mb={theme.dimensions.marginBetween}>
          <ScheduleAppointmentOrNeedToCancel />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default UpcomingAppointmentDetails

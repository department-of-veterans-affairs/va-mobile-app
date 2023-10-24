import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, useEffect } from 'react'

import {
  AppointmentAddressAndNumber,
  AppointmentAlert,
  AppointmentReason,
  AppointmentTypeAndDate,
  ContactInformation,
  PendingAppointmentCancelButton,
  PreferredAppointmentType,
  PreferredDateAndTime,
  ProviderName,
} from '../AppointmentDetailsCommon'
import {
  AppointmentAttributes,
  AppointmentCancellationStatusConstants,
  AppointmentData,
  AppointmentLocation,
  AppointmentStatusConstants,
  AppointmentTypeConstants,
  AppointmentTypeToID,
} from 'store/api/types'
import { AppointmentsState, clearAppointmentCancellation, trackAppointmentDetail } from 'store/slices'
import {
  Box,
  ButtonTypesConstants,
  ClickForActionLink,
  FeatureLandingTemplate,
  LinkButtonProps,
  LinkTypeOptionsConstants,
  LoadingComponent,
  TextArea,
  TextView,
  TextViewProps,
  VAButton,
  VAButtonProps,
} from 'components'
import { Events } from 'constants/analytics'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { a11yLabelVA } from 'utils/a11yLabel'
import { featureEnabled } from 'utils/remoteConfig'
import { getAppointmentAnalyticsDays, getAppointmentAnalyticsStatus, isAPendingAppointment } from 'utils/appointments'
import { getEpochSecondsOfDate, getTranslation } from 'utils/formattingUtils'
import { isIOS } from 'utils/platform'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import AppointmentCancellationInfo from './AppointmentCancellationInfo'
type UpcomingAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'UpcomingAppointmentDetails'>

// export const JOIN_SESSION_WINDOW_MINUTES = 30

const UpcomingAppointmentDetails: FC<UpcomingAppointmentDetailsProps> = ({ route, navigation }) => {
  const { appointmentID } = route.params

  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const launchExternalLink = useExternalLink()
  const { upcomingAppointmentsById, loadingAppointmentCancellation, appointmentCancellationStatus } = useSelector<RootState, AppointmentsState>((state) => state.appointments)

  const appointment = upcomingAppointmentsById?.[appointmentID]
  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, location, startDateUtc, minutesDuration, comment, status, isCovidVaccine } = attributes || ({} as AppointmentAttributes)
  const { name, code, url, lat, long, address } = location || ({} as AppointmentLocation)
  const isAppointmentCanceled = status === AppointmentStatusConstants.CANCELLED
  const pendingAppointment = isAPendingAppointment(attributes)

  useEffect(() => {
    dispatch(
      trackAppointmentDetail(
        pendingAppointment,
        appointmentID,
        getAppointmentAnalyticsStatus(attributes),
        attributes.appointmentType.toString(),
        getAppointmentAnalyticsDays(attributes),
      ),
    )
  }, [dispatch, appointmentID, pendingAppointment, attributes])

  useEffect(() => {
    if (appointmentCancellationStatus === AppointmentCancellationStatusConstants.FAIL) {
      dispatch(clearAppointmentCancellation())
    } else if (appointmentCancellationStatus === AppointmentCancellationStatusConstants.SUCCESS) {
      dispatch(clearAppointmentCancellation())
      navigation.goBack()
    }
  }, [appointmentCancellationStatus, dispatch, navigation])

  const goBack = (): void => {
    dispatch(clearAppointmentCancellation())
    navigation.goBack()
  }

  const getLocation = (): string => {
    if (isIOS() && lat && long) {
      return name || ''
    } else if (address?.street && address?.city && address?.state && address?.zipCode) {
      return `${address.street} ${address.city}, ${address.state} ${address.zipCode}`
    } else {
      return name || ''
    }
  }

  const calendarAnalytics = (): void => {
    logAnalyticsEvent(
      Events.vama_apt_add_cal(appointmentID, getAppointmentAnalyticsStatus(attributes), attributes.appointmentType.toString(), getAppointmentAnalyticsDays(attributes)),
    )
  }

  const startTimeDate = startDateUtc ? new Date(startDateUtc) : new Date()
  const endTime = minutesDuration ? new Date(startTimeDate.setMinutes(startTimeDate.getMinutes() + minutesDuration)).toISOString() : startTimeDate.toISOString()
  const addToCalendarProps: LinkButtonProps = {
    displayedText: t('upcomingAppointments.addToCalendar'),
    a11yLabel: t('upcomingAppointments.addToCalendar'),
    linkType: LinkTypeOptionsConstants.calendar,
    metaData: {
      title: getTranslation(isCovidVaccine ? 'upcomingAppointments.covidVaccine' : AppointmentTypeToID[appointmentType], t),
      startTime: getEpochSecondsOfDate(startDateUtc),
      endTime: getEpochSecondsOfDate(endTime),
      location: getLocation(),
      latitude: lat || 0,
      longitude: long || 0,
    },
    testID: 'addToCalendarTestID',
    fireAnalytic: calendarAnalytics,
  }

  // TODO abstract some of these render functions into their own components - too many in one file
  const SpecialInstructions = (): ReactElement => {
    if (comment) {
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
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
        return t('upcomingAppointmentDetails.howToJoinInstructionsVALocation')
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
        return t('upcomingAppointmentDetails.howToJoinInstructionsVADevice')
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
        return t('upcomingAppointmentDetails.howToJoinInstructionsAtlas')
      default:
        return ''
    }
  }

  const VideoAppointment_HowToJoin = (): ReactElement => {
    const isGFE = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE
    const isVideoAppt = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE || isGFE

    if (isVideoAppt && !isAppointmentCanceled) {
      return (
        <Box mb={isGFE ? 0 : theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.howToJoin')}
          </TextView>
          <TextView variant="MobileBody">{getVideoInstructionsTranslationID()}</TextView>
        </Box>
      )
    }

    return <></>
  }

  const VAVCAtHome_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME && !isAppointmentCanceled) {
      const onPrepareForVideoVisit = () => {
        dispatch(clearAppointmentCancellation())
        navigateTo('PrepareForVideoVisit')()
      }
      // TODO uncomment for #17916
      const hasSessionStarted = true // DateTime.fromISO(startDateUtc).diffNow().as('minutes') <= JOIN_SESSION_WINDOW_MINUTES

      const joinSessionOnPress = (): void => {
        dispatch(clearAppointmentCancellation())

        if (url) {
          launchExternalLink(url)
        } else {
          navigateTo('SessionNotStarted')()
        }
      }

      const joinSessionButtonProps: VAButtonProps = {
        label: t('upcomingAppointmentDetails.joinSession'),
        testID: t('upcomingAppointmentDetails.joinSession'),
        buttonType: ButtonTypesConstants.buttonPrimary,
        a11yHint: t('upcomingAppointmentDetails.howToJoinVirtualSessionA11yHint'),
        onPress: joinSessionOnPress,
        disabled: !hasSessionStarted,
        disabledText: t('upcomingAppointmentDetails.joinSession.disabledText'),
      }

      const prepareForVideoVisitLinkProps: TextViewProps = {
        py: theme.dimensions.buttonPadding,
        variant: 'MobileBodyLink',
        onPress: onPrepareForVideoVisit,
        accessibilityRole: 'link',
      }

      return (
        <Box>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.howToJoinVirtualSession')}
          </TextView>
          <TextView variant="MobileBody">{t('upcomingAppointmentDetails.howToJoinInstructionsVAAtHome')}</TextView>

          <Box my={theme.dimensions.standardMarginBetween}>
            <VAButton {...joinSessionButtonProps} />
          </Box>

          <TextView {...prepareForVideoVisitLinkProps} {...testIdProps(t('upcomingAppointmentDetails.prepareForVideoVisit'))}>
            {t('upcomingAppointmentDetails.prepareForVideoVisit')}
          </TextView>
        </Box>
      )
    }

    return <></>
  }

  const Atlas_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS && !isAppointmentCanceled && code) {
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.appointmentCode', { code: code })}
          </TextView>
          <TextView variant="MobileBody">{t('upcomingAppointmentDetails.useCode')}</TextView>
        </Box>
      )
    }

    return <></>
  }

  const AddToCalendar = (): ReactElement => {
    if (!isAppointmentCanceled && !pendingAppointment) {
      return (
        <Box my={theme.dimensions.standardMarginBetween}>
          <ClickForActionLink {...addToCalendarProps} {...a11yHintProp(t('upcomingAppointmentDetails.addToCalendarA11yHint'))} />
        </Box>
      )
    }

    return <></>
  }

  const readerCancelInformation = (): ReactElement => {
    if (pendingAppointment) {
      return <></>
    }

    return (
      <Box mt={theme.dimensions.condensedMarginBetween}>
        {!isAppointmentCanceled ? (
          <AppointmentCancellationInfo appointment={appointment} goBack={goBack} />
        ) : (
          <TextArea>
            <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('pastAppointmentDetails.toScheduleAnotherAppointment'))}>
              {t('pastAppointmentDetails.toScheduleAnotherAppointment')}
            </TextView>
          </TextArea>
        )}
      </Box>
    )
  }

  if (loadingAppointmentCancellation) {
    return (
      <FeatureLandingTemplate backLabel={t('appointments')} backLabelOnPress={navigation.goBack} title={t('details')}>
        <LoadingComponent text={t('upcomingAppointmentDetails.loadingAppointmentCancellation')} />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('appointments')} backLabelOnPress={navigation.goBack} title={t('details')} testID="UpcomingApptDetailsTestID">
      <Box mb={theme.dimensions.contentMarginBottom}>
        <AppointmentAlert attributes={attributes} />
        <TextArea>
          <AppointmentTypeAndDate attributes={attributes} isPastAppointment={false} />
          <AddToCalendar />

          <VideoAppointment_HowToJoin />

          <VAVCAtHome_AppointmentData />

          <ProviderName attributes={attributes} />

          <AppointmentAddressAndNumber attributes={attributes} />

          <Atlas_AppointmentData />
          <SpecialInstructions />
          {featureEnabled('patientCheckIn') && (
            <Box my={theme.dimensions.gutter} mr={theme.dimensions.buttonPadding}>
              <VAButton onPress={navigateTo('ConfirmContactInfo')} label={t('checkIn.now')} buttonType={ButtonTypesConstants.buttonPrimary} />
            </Box>
          )}
          <PreferredDateAndTime attributes={attributes} />
          <PreferredAppointmentType attributes={attributes} />
          <AppointmentReason attributes={attributes} />
          <ContactInformation attributes={attributes} />
          <PendingAppointmentCancelButton attributes={attributes} appointmentID={appointment?.id} />
        </TextArea>

        {readerCancelInformation()}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default UpcomingAppointmentDetails

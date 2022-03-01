import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactElement, useEffect } from 'react'

import {
  AlertBox,
  BackButton,
  Box,
  ButtonTypesConstants,
  ClickForActionLink,
  ClickToCallPhoneNumber,
  LinkButtonProps,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  LoadingComponent,
  TextArea,
  TextView,
  TextViewProps,
  VAButton,
  VAButtonProps,
  VAScrollView,
} from 'components'
import {
  AppointmentAddressAndNumber,
  AppointmentReason,
  AppointmentTypeAndDate,
  ContactInformation,
  PendingAppointmentAlert,
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
import { AppointmentsState, clearAppointmentCancellation, getAppointmentMessages, trackAppointmentDetail } from 'store/slices'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from '../../HealthStackScreens'
import { InteractionManager } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { getEpochSecondsOfDate } from 'utils/formattingUtils'
import { isAPendingAppointment } from 'utils/appointments'
import { useAppDispatch, useExternalLink, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import { useSelector } from 'react-redux'
import AppointmentCancellationInfo from './AppointmentCancellationInfo'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type UpcomingAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'UpcomingAppointmentDetails'>

// export const JOIN_SESSION_WINDOW_MINUTES = 30

const UpcomingAppointmentDetails: FC<UpcomingAppointmentDetailsProps> = ({ route, navigation }) => {
  const { appointmentID } = route.params

  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const launchExternalLink = useExternalLink()
  const { upcomingAppointmentsById, loadingAppointmentCancellation, appointmentCancellationStatus, appointmentMessagesById } = useSelector<RootState, AppointmentsState>(
    (state) => state.appointments,
  )

  const appointment = upcomingAppointmentsById?.[appointmentID]
  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, location, startDateUtc, minutesDuration, comment, status, isCovidVaccine } = attributes || ({} as AppointmentAttributes)
  const { name, phone, code, url } = location || ({} as AppointmentLocation)
  const isAppointmentCanceled = status === AppointmentStatusConstants.CANCELLED
  const pendingAppointment = isAPendingAppointment(attributes)
  const [isTransitionComplete, setIsTransitionComplete] = React.useState(false)
  const messages = appointmentMessagesById[appointmentID]

  useEffect(() => {
    dispatch(trackAppointmentDetail())
    InteractionManager.runAfterInteractions(() => {
      setIsTransitionComplete(true)
    })
  }, [dispatch, appointmentID])

  useEffect(() => {
    if (appointment && isAPendingAppointment && !appointmentMessagesById[appointmentID]) {
      dispatch(getAppointmentMessages(appointmentID))
    }
  }, [dispatch, appointment, appointmentID, appointmentMessagesById])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={goBack} canGoBack={true} label={BackButtonLabelConstants.back} showCarat={true} />,
    })
  })

  const goBack = (): void => {
    dispatch(clearAppointmentCancellation())
    navigation.goBack()
  }

  const startTimeDate = startDateUtc ? new Date(startDateUtc) : new Date()
  const endTime = startDateUtc && minutesDuration ? new Date(startTimeDate.setMinutes(startTimeDate.getMinutes() + minutesDuration)).toISOString() : ''
  const addToCalendarProps: LinkButtonProps = {
    displayedText: t('upcomingAppointments.addToCalendar'),
    linkType: LinkTypeOptionsConstants.calendar,
    metaData: {
      title: t(isCovidVaccine ? 'upcomingAppointments.covidVaccine' : AppointmentTypeToID[appointmentType]),
      startTime: getEpochSecondsOfDate(startDateUtc),
      endTime: getEpochSecondsOfDate(endTime),
      location: name,
    },
  }

  // TODO abstract some of these render functions into their own components - too many in one file
  const CommunityCare_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE && !isAppointmentCanceled && comment) {
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
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

    if (isVideoAppt && !isAppointmentCanceled) {
      return (
        <Box mb={isGFE ? 0 : theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {t('upcomingAppointmentDetails.howToJoin')}
          </TextView>
          <TextView variant="MobileBody">{t(getVideoInstructionsTranslationID())}</TextView>
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
        launchExternalLink(url || '')
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
        color: 'link',
        onPress: onPrepareForVideoVisit,
        accessibilityRole: 'link',
      }

      return (
        <Box>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
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
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
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

  const renderCancellationAlert = (): ReactElement => {
    if (appointmentCancellationStatus === AppointmentCancellationStatusConstants.SUCCESS) {
      return (
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          <AlertBox title={t('upcomingAppointmentDetails.cancelAppointmentSuccess.title')} text={t('upcomingAppointmentDetails.cancelAppointmentSuccess.body')} border="success" />
        </Box>
      )
    } else if (appointmentCancellationStatus === AppointmentCancellationStatusConstants.FAIL) {
      const areaCode = phone?.areaCode
      const phoneNumber = phone?.number
      const findYourVALocationProps: LinkButtonProps = {
        displayedText: t('upcomingAppointmentDetails.findYourVALocation'),
        linkType: LinkTypeOptionsConstants.url,
        linkUrlIconType: LinkUrlIconType.Arrow,
        numberOrUrlLink: WEBVIEW_URL_FACILITY_LOCATOR,
        testID: t('upcomingAppointmentDetails.findYourVALocation.a11yLabel'),
        accessibilityHint: t('upcomingAppointmentDetails.findYourVALocation.a11yHint'),
      }

      return (
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          <AlertBox title={t('upcomingAppointmentDetails.cancelAppointmentFail.title')} text={t('upcomingAppointmentDetails.cancelAppointmentFail.body')} border="error">
            <Box my={theme.dimensions.standardMarginBetween}>
              <TextView color="primary" variant="MobileBodyBold" {...testIdProps(location.name)}>
                {location.name}
              </TextView>
            </Box>
            {areaCode && phoneNumber && (
              <Box>
                <ClickToCallPhoneNumber displayedText={areaCode + '-' + phoneNumber} phone={areaCode + '-' + phoneNumber} />
              </Box>
            )}
            {!phone && (
              <Box>
                <ClickForActionLink {...findYourVALocationProps} />
              </Box>
            )}
          </AlertBox>
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
          <AppointmentCancellationInfo appointment={appointment} />
        ) : (
          <TextArea>
            <TextView variant="MobileBody" {...testIdProps(t('pastAppointmentDetails.toScheduleAnotherAppointmentA11yLabel'))}>
              {t('pastAppointmentDetails.toScheduleAnotherAppointment')}
            </TextView>
          </TextArea>
        )}
      </Box>
    )
  }

  if (loadingAppointmentCancellation || !isTransitionComplete) {
    return <LoadingComponent text={t(!isTransitionComplete ? 'appointmentDetails.loading' : 'upcomingAppointmentDetails.loadingAppointmentCancellation')} />
  }

  return (
    <VAScrollView {...testIdProps('Appointment-details-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <PendingAppointmentAlert attributes={attributes} />
        {renderCancellationAlert()}
        <TextArea>
          <AppointmentTypeAndDate attributes={attributes} />
          <AddToCalendar />

          <VideoAppointment_HowToJoin />

          <VAVCAtHome_AppointmentData />

          <ProviderName attributes={attributes} />

          <AppointmentAddressAndNumber attributes={attributes} />

          <Atlas_AppointmentData />
          <CommunityCare_AppointmentData />

          <PreferredDateAndTime attributes={attributes} />
          <PreferredAppointmentType attributes={attributes} />
          <AppointmentReason attributes={attributes} messages={messages} />
          <ContactInformation attributes={attributes} />
          <PendingAppointmentCancelButton attributes={attributes} appointmentID={appointment?.id} />
        </TextArea>

        {readerCancelInformation()}
      </Box>
    </VAScrollView>
  )
}

export default UpcomingAppointmentDetails

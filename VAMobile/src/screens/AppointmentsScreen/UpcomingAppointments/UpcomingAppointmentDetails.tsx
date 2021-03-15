import { Linking, ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect } from 'react'

import {
  AlertBox,
  BackButton,
  Box,
  ButtonTypesConstants,
  ClickForActionLink,
  LinkButtonProps,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  LoadingComponent,
  TextArea,
  TextView,
  TextViewProps,
  VAButton,
  VAButtonProps,
} from 'components'
import {
  AppointmentAttributes,
  AppointmentCancellationStatusConstants,
  AppointmentData,
  AppointmentLocation,
  AppointmentStatusConstants,
  AppointmentTypeConstants,
  AppointmentTypeToID,
} from 'store/api/types'
import { AppointmentsStackParamList } from '../AppointmentStackScreens'
import { AppointmentsState, StoreState } from 'store/reducers'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { clearAppointmentCancellation, getAppointment } from 'store/actions'
import { getEpochSecondsOfDate } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AppointmentAddressAndNumber from '../AppointmentDetailsCommon/AppointmentAddressAndNumber'
import AppointmentCancellationInfo from './AppointmentCancellationInfo'
import AppointmentTypeAndDate from '../AppointmentDetailsCommon/AppointmentTypeAndDate'
import ProviderName from '../AppointmentDetailsCommon/ProviderName'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type UpcomingAppointmentDetailsProps = StackScreenProps<AppointmentsStackParamList, 'UpcomingAppointmentDetails'>

// export const JOIN_SESSION_WINDOW_MINUTES = 30

const UpcomingAppointmentDetails: FC<UpcomingAppointmentDetailsProps> = ({ route, navigation }) => {
  const { appointmentID } = route.params

  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { appointment, loadingAppointmentCancellation, appointmentCancellationStatus } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, healthcareService, location, startDateUtc, minutesDuration, timeZone, comment, practitioner, status } = attributes || ({} as AppointmentAttributes)
  const { name, address, phone, code, url } = location || ({} as AppointmentLocation)
  const isAppointmentCanceled = status === AppointmentStatusConstants.CANCELLED

  useEffect(() => {
    dispatch(getAppointment(appointmentID))
  }, [dispatch, appointmentID])

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
      title: t(AppointmentTypeToID[appointmentType]),
      startTime: getEpochSecondsOfDate(startDateUtc),
      endTime: getEpochSecondsOfDate(endTime),
      location: name,
    },
  }

  const CommunityCare_AppointmentData = (): ReactElement => {
    if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE && !isAppointmentCanceled && comment) {
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
    if (appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME && !isAppointmentCanceled) {
      const onPrepareForVideoVisit = () => {
        dispatch(clearAppointmentCancellation())
        navigateTo('PrepareForVideoVisit')()
      }
      // TODO uncomment for #17916
      const hasSessionStarted = true // DateTime.fromISO(startDateUtc).diffNow().as('minutes') <= JOIN_SESSION_WINDOW_MINUTES

      const joinSessionOnPress = (): void => {
        dispatch(clearAppointmentCancellation())
        Linking.openURL(url || '')
      }

      const joinSessionButtonProps: VAButtonProps = {
        label: t('upcomingAppointmentDetails.joinSession'),
        testID: t('upcomingAppointmentDetails.joinSession'),
        buttonType: ButtonTypesConstants.buttonPrimary,
        a11yHint: t('upcomingAppointmentDetails.howToJoinVirtualSessionA11yHint'),
        onPress: joinSessionOnPress,
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
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.howToJoinVirtualSession')}
          </TextView>
          <TextView variant="MobileBody">{t('upcomingAppointmentDetails.howToJoinInstructionsVAAtHome')}</TextView>

          {hasSessionStarted && (
            <Box my={theme.dimensions.standardMarginBetween}>
              <VAButton {...joinSessionButtonProps} />
            </Box>
          )}

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
    if (!isAppointmentCanceled) {
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
          <AlertBox
            title={t('upcomingAppointmentDetails.cancelAppointmentSuccess.title')}
            text={t('upcomingAppointmentDetails.cancelAppointmentSuccess.body')}
            border="success"
            background="noCardBackground"
          />
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
          <AlertBox
            title={t('upcomingAppointmentDetails.cancelAppointmentFail.title')}
            text={t('upcomingAppointmentDetails.cancelAppointmentFail.body')}
            border="error"
            background="noCardBackground">
            <Box my={theme.dimensions.standardMarginBetween}>
              <TextView color="primary" variant="MobileBodyBold" {...testIdProps(location.name)}>
                {location.name}
              </TextView>
            </Box>
            {areaCode && phoneNumber && (
              <Box>
                <ClickForActionLink
                  displayedText={areaCode + '-' + phoneNumber}
                  numberOrUrlLink={areaCode + '-' + phoneNumber}
                  linkType={LinkTypeOptionsConstants.call}
                  accessibilityRole="link"
                  {...testIdProps(areaCode + '-' + phoneNumber)}
                  {...a11yHintProp(t('upcomingAppointmentDetails.callNumberA11yHint'))}
                />
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

  if (loadingAppointmentCancellation) {
    return <LoadingComponent text={t('upcomingAppointmentDetails.loadingAppointmentCancellation')} />
  }

  return (
    <ScrollView {...testIdProps('Appointment-details-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        {renderCancellationAlert()}
        <TextArea>
          <AppointmentTypeAndDate timeZone={timeZone} startDateUtc={startDateUtc} appointmentType={appointmentType} isAppointmentCanceled={isAppointmentCanceled} />

          <AddToCalendar />

          <VideoAppointment_HowToJoin />

          <VAVCAtHome_AppointmentData />

          <ProviderName appointmentType={appointmentType} practitioner={practitioner} />

          <AppointmentAddressAndNumber appointmentType={appointmentType} healthcareService={healthcareService} address={address} location={location} phone={phone} />

          <Atlas_AppointmentData />

          <CommunityCare_AppointmentData />
        </TextArea>

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
      </Box>
    </ScrollView>
  )
}

export default UpcomingAppointmentDetails

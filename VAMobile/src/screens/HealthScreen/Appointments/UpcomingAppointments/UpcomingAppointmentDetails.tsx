import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import {
  Box,
  ClickForActionLink,
  ClickToCallPhoneNumber,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkButtonProps,
  LinkTypeOptionsConstants,
  LoadingComponent,
  TextArea,
  TextView,
  TextViewProps,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import {
  AppointmentAttributes,
  AppointmentCancellationStatusConstants,
  AppointmentData,
  AppointmentLocation,
  AppointmentStatusConstants,
  AppointmentTypeConstants,
  AppointmentTypeToID,
  ScreenIDTypesConstants,
} from 'store/api/types'
import { AppointmentsState, clearAppointmentCancellation, trackAppointmentDetail } from 'store/slices'
import { a11yLabelVA } from 'utils/a11yLabel'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { logAnalyticsEvent } from 'utils/analytics'
import { getAppointmentAnalyticsDays, getAppointmentAnalyticsStatus, isAPendingAppointment } from 'utils/appointments'
import getEnv from 'utils/env'
import { getEpochSecondsOfDate, getTranslation } from 'utils/formattingUtils'
import { useAppDispatch, useError, useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'
import { featureEnabled } from 'utils/remoteConfig'

import { HealthStackParamList } from '../../HealthStackScreens'
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
  TypeOfCare,
} from '../AppointmentDetailsCommon'
import AppointmentCancellationInfo from './AppointmentCancellationInfo'

type UpcomingAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'UpcomingAppointmentDetails'>

const { LINK_URL_VA_SCHEDULING } = getEnv()
// export const JOIN_SESSION_WINDOW_MINUTES = 30

function UpcomingAppointmentDetails({ route, navigation }: UpcomingAppointmentDetailsProps) {
  let { appointmentID } = route.params
  const { vetextID } = route.params

  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const launchExternalLink = useExternalLink()
  const screenError = useError(ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID)
  const { upcomingAppointmentsById, loading, loadingAppointmentCancellation, appointmentCancellationStatus } =
    useSelector<RootState, AppointmentsState>((state) => state.appointments)

  const appointment = appointmentID
    ? upcomingAppointmentsById?.[appointmentID]
    : Object.values(upcomingAppointmentsById || []).find(
        (appointmentData) => appointmentData.attributes.vetextId === vetextID,
      )

  const appointmentNotFound = vetextID && !loading && !appointment

  if (!appointmentID) {
    appointmentID = appointment?.id
  }

  const { attributes } = (appointment || {}) as AppointmentData
  const {
    appointmentType,
    location,
    startDateUtc,
    minutesDuration,
    comment,
    status,
    isCovidVaccine,
    phoneOnly,
    serviceCategoryName,
  } = attributes || ({} as AppointmentAttributes)
  const { name, code, url, lat, long, address } = location || ({} as AppointmentLocation)
  const isAppointmentCanceled = status === AppointmentStatusConstants.CANCELLED
  const pendingAppointment = isAPendingAppointment(attributes)

  useEffect(() => {
    attributes &&
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

  useEffect(() => {
    if (!screenError && appointmentNotFound) {
      logAnalyticsEvent(Events.vama_appt_deep_link_fail(vetextID))
    }
  }, [appointmentNotFound, screenError, vetextID])

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
    appointmentID &&
      logAnalyticsEvent(
        Events.vama_apt_add_cal(
          appointmentID,
          getAppointmentAnalyticsStatus(attributes),
          attributes.appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
        ),
      )
  }

  const startTimeDate = startDateUtc ? new Date(startDateUtc) : new Date()
  const endTime = minutesDuration
    ? new Date(startTimeDate.setMinutes(startTimeDate.getMinutes() + minutesDuration)).toISOString()
    : startTimeDate.toISOString()
  const addToCalendarProps: LinkButtonProps = {
    displayedText: t('upcomingAppointments.addToCalendar'),
    a11yLabel: t('upcomingAppointments.addToCalendar'),
    linkType: LinkTypeOptionsConstants.calendar,
    metaData: {
      title: getTranslation(
        isCovidVaccine ? 'upcomingAppointments.covidVaccine' : AppointmentTypeToID[appointmentType],
        t,
      ),
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
  function renderSpecialInstructions() {
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

  function renderVideoAppointmentInstructions() {
    const isGFE = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE
    const isVideoAppt =
      appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS ||
      appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE ||
      isGFE

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

  function renderAtHomeVideoConnectAppointmentData() {
    if (appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME && !isAppointmentCanceled) {
      const onPrepareForVideoVisit = () => {
        dispatch(clearAppointmentCancellation())

        navigateTo('PrepareForVideoVisit')
      }

      const joinSessionOnPress = (): void => {
        dispatch(clearAppointmentCancellation())

        if (url) {
          launchExternalLink(url)
        } else {
          navigateTo('SessionNotStarted')
        }
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
            <Button
              label={t('upcomingAppointmentDetails.joinSession')}
              testID={t('upcomingAppointmentDetails.joinSession')}
              a11yHint={t('upcomingAppointmentDetails.howToJoinVirtualSessionA11yHint')}
              onPress={joinSessionOnPress}
            />
          </Box>

          <TextView
            {...prepareForVideoVisitLinkProps}
            {...testIdProps(t('upcomingAppointmentDetails.prepareForVideoVisit'))}
            testID="prepareForVideoVisitTestID">
            {t('upcomingAppointmentDetails.prepareForVideoVisit')}
          </TextView>
        </Box>
      )
    }

    return <></>
  }

  function renderAtlasVideoConnectAppointmentData() {
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

  function renderAddToCalendarLink() {
    if (!isAppointmentCanceled && !pendingAppointment) {
      return (
        <Box
          mt={phoneOnly ? undefined : theme.dimensions.standardMarginBetween}
          mb={theme.dimensions.standardMarginBetween}>
          <ClickForActionLink
            {...addToCalendarProps}
            {...a11yHintProp(t('upcomingAppointmentDetails.addToCalendarA11yHint'))}
          />
        </Box>
      )
    }

    return <></>
  }

  function readerCancelInformation() {
    if (pendingAppointment) {
      return <></>
    }

    return (
      <Box mt={theme.dimensions.condensedMarginBetween}>
        {!isAppointmentCanceled ? (
          <AppointmentCancellationInfo appointment={appointment} goBack={goBack} />
        ) : phoneOnly ||
          (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION') ? (
          <Box mt={theme.dimensions.condensedMarginBetween}>
            <TextArea>
              <TextView
                variant="MobileBodyBold"
                accessibilityRole="header"
                mb={theme.dimensions.condensedMarginBetween}>
                {t('appointments.reschedule.title')}
              </TextView>
              <TextView variant="MobileBody" paragraphSpacing={true}>
                {t('appointments.reschedule.body')}
              </TextView>
              {location?.phone && location.phone.areaCode && location.phone.number ? (
                <ClickToCallPhoneNumber phone={location.phone} />
              ) : undefined}
              <ClickForActionLink
                displayedText={t('appointments.vaSchedule')}
                a11yLabel={a11yLabelVA(t('appointments.vaSchedule'))}
                numberOrUrlLink={LINK_URL_VA_SCHEDULING}
                linkType={LinkTypeOptionsConstants.externalLink}
              />
            </TextArea>
          </Box>
        ) : (
          <TextArea>
            <TextView
              variant="MobileBody"
              accessibilityLabel={a11yLabelVA(t('pastAppointmentDetails.toScheduleAnotherAppointment'))}>
              {t('pastAppointmentDetails.toScheduleAnotherAppointment')}
            </TextView>
          </TextArea>
        )}
      </Box>
    )
  }

  if (screenError || appointmentNotFound) {
    return (
      <FeatureLandingTemplate backLabel={t('appointments')} backLabelOnPress={navigation.goBack} title={t('details')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loadingAppointmentCancellation || loading) {
    return (
      <FeatureLandingTemplate backLabel={t('appointments')} backLabelOnPress={navigation.goBack} title={t('details')}>
        <LoadingComponent
          text={
            loadingAppointmentCancellation
              ? t('upcomingAppointmentDetails.loadingAppointmentCancellation')
              : t('appointmentDetails.loading')
          }
        />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('appointments')}
      backLabelOnPress={navigation.goBack}
      title={t('details')}
      testID="UpcomingApptDetailsTestID">
      <Box mb={theme.dimensions.contentMarginBottom}>
        <AppointmentAlert attributes={attributes} />
        <TextArea>
          <AppointmentTypeAndDate attributes={attributes} isPastAppointment={false} />
          {renderAddToCalendarLink()}

          {renderVideoAppointmentInstructions()}

          {renderAtHomeVideoConnectAppointmentData()}
          <TypeOfCare attributes={attributes} />
          <ProviderName attributes={attributes} />

          <AppointmentAddressAndNumber attributes={attributes} isPastAppointment={false} />

          {renderAtlasVideoConnectAppointmentData()}
          {featureEnabled('patientCheckIn') && (
            <Box my={theme.dimensions.gutter} mr={theme.dimensions.buttonPadding}>
              <Button onPress={() => navigateTo('ConfirmContactInfo')} label={t('checkIn.now')} />
            </Box>
          )}
          <PreferredDateAndTime attributes={attributes} />
          <PreferredAppointmentType attributes={attributes} />
          <AppointmentReason attributes={attributes} />
          {renderSpecialInstructions()}
          <ContactInformation attributes={attributes} />
          <PendingAppointmentCancelButton attributes={attributes} appointmentID={appointmentID} />
        </TextArea>

        {readerCancelInformation()}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default UpcomingAppointmentDetails

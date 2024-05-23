import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { useAppointments, useCancelAppointment } from 'api/appointments'
import {
  AppointmentAttributes,
  AppointmentData,
  AppointmentLocation,
  AppointmentStatusConstants,
  AppointmentTypeConstants,
  AppointmentTypeToID,
} from 'api/types'
import {
  Box,
  ClickToCallPhoneNumber,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  TextArea,
  TextView,
  TextViewProps,
} from 'components'
import { Events, UserAnalytics } from 'constants/analytics'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import {
  AppointmentDetailsSubTypeConstants,
  getAppointmentAnalyticsDays,
  getAppointmentAnalyticsStatus,
  isAPendingAppointment,
} from 'utils/appointments'
import getEnv from 'utils/env'
import { getEpochSecondsOfDate, getTranslation } from 'utils/formattingUtils'
import { useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'
import { registerReviewEvent } from 'utils/inAppReviews'
import { isIOS } from 'utils/platform'
import { featureEnabled } from 'utils/remoteConfig'
import { addToCalendar, checkCalendarPermission, requestCalendarPermission } from 'utils/rnCalendar'

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
import ClinicNameAndPhysicalLocation from '../AppointmentDetailsCommon/ClinicNameAndPhysicalLocation'
import { InPersonVAAppointment, PhoneAppointment } from '../AppointmentTypeComponents'
import ClaimExamAppointment from '../AppointmentTypeComponents/ClaimExamAppointment'
import { getUpcomingAppointmentDateRange } from '../Appointments'
import AppointmentCancellationInfo from './AppointmentCancellationInfo'

type UpcomingAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'UpcomingAppointmentDetails'>

const { LINK_URL_VA_SCHEDULING } = getEnv()
// export const JOIN_SESSION_WINDOW_MINUTES = 30

function UpcomingAppointmentDetails({ route, navigation }: UpcomingAppointmentDetailsProps) {
  const { appointment, vetextID } = route.params
  const { page } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const launchExternalLink = useExternalLink()
  const dateRange = getUpcomingAppointmentDateRange()
  const {
    data: apptsData,
    isFetching: loadingAppointments,
    error: getApptError,
    refetch: refetchAppointments,
  } = useAppointments(dateRange.startDate, dateRange.endDate, TimeFrameTypeConstants.UPCOMING, 1, {
    enabled: !appointment,
  })

  const { mutate: cancelAppointment, isPending: loadingAppointmentCancellation } = useCancelAppointment(page || 1)

  const trueAppointment =
    appointment ||
    Object.values(apptsData?.data || []).find((appointmentData) => appointmentData.attributes.vetextId === vetextID)

  const appointmentNotFound = !!vetextID && !loadingAppointments && !trueAppointment

  const { attributes } = (trueAppointment || {}) as AppointmentData
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
    if (attributes) {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_appointments())
      logAnalyticsEvent(
        Events.vama_appt_view_details(
          !!pendingAppointment,
          trueAppointment?.id,
          getAppointmentAnalyticsStatus(attributes),
          attributes.appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
        ),
      )
      registerReviewEvent()
    }
  }, [trueAppointment, pendingAppointment, attributes])

  useEffect(() => {
    if (!getApptError && appointmentNotFound) {
      logAnalyticsEvent(Events.vama_appt_deep_link_fail(vetextID))
    }
  }, [appointmentNotFound, getApptError, vetextID])

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
    trueAppointment &&
      logAnalyticsEvent(
        Events.vama_apt_add_cal(
          trueAppointment.id,
          getAppointmentAnalyticsStatus(attributes),
          attributes.appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
        ),
      )
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
      const joinSessionOnPress = (): void => {
        if (url) {
          launchExternalLink(url)
        } else {
          navigateTo('SessionNotStarted')
        }
      }

      const prepareForVideoVisitLinkProps: TextViewProps = {
        py: theme.dimensions.buttonPadding,
        variant: 'MobileBodyLink',
        onPress: () => navigateTo('PrepareForVideoVisit'),
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

          <TextView {...prepareForVideoVisitLinkProps} testID="prepareForVideoVisitTestID">
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

  const calendarOnPress = async () => {
    calendarAnalytics()

    const startTimeDate = startDateUtc ? new Date(startDateUtc) : new Date()
    const endTime = minutesDuration
      ? new Date(startTimeDate.setMinutes(startTimeDate.getMinutes() + minutesDuration)).toISOString()
      : startTimeDate.toISOString()

    const title = getTranslation(
      isCovidVaccine ? 'upcomingAppointments.covidVaccine' : AppointmentTypeToID[appointmentType],
      t,
    )
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

  function renderAddToCalendarLink() {
    if (!isAppointmentCanceled && !pendingAppointment) {
      return (
        <Box
          mt={phoneOnly ? undefined : theme.dimensions.standardMarginBetween}
          mb={theme.dimensions.standardMarginBetween}>
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
          <AppointmentCancellationInfo
            appointment={appointment}
            goBack={navigation.goBack}
            cancelAppointment={cancelAppointment}
          />
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
              <TextView
                variant="MobileBody"
                accessibilityLabel={a11yLabelVA(t('appointments.reschedule.body'))}
                paragraphSpacing={true}>
                {t('appointments.reschedule.body')}
              </TextView>
              {location?.phone && location.phone.areaCode && location.phone.number ? (
                <ClickToCallPhoneNumber phone={location.phone} />
              ) : undefined}
              <LinkWithAnalytics
                type="url"
                url={LINK_URL_VA_SCHEDULING}
                text={t('appointments.vaSchedule')}
                a11yLabel={a11yLabelVA(t('appointments.vaSchedule'))}
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

  const hasError = getApptError || appointmentNotFound
  const isLoading = loadingAppointmentCancellation || loadingAppointments
  const isInPersonVAAppointment =
    appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION'
  const isPhoneAppointment = phoneOnly
  const isClaimExamAppointment = serviceCategoryName === 'COMPENSATION & PENSION'

  const subType =
    isAppointmentCanceled && pendingAppointment
      ? AppointmentDetailsSubTypeConstants.CanceledAndPending
      : isAppointmentCanceled
        ? AppointmentDetailsSubTypeConstants.Canceled
        : pendingAppointment
          ? AppointmentDetailsSubTypeConstants.Pending
          : AppointmentDetailsSubTypeConstants.Upcoming

  return (
    <FeatureLandingTemplate
      backLabel={t('appointments')}
      backLabelOnPress={navigation.goBack}
      title={t('details')}
      testID="UpcomingApptDetailsTestID">
      {isLoading ? (
        <LoadingComponent
          text={
            loadingAppointmentCancellation
              ? t('upcomingAppointmentDetails.loadingAppointmentCancellation')
              : t('appointmentDetails.loading')
          }
        />
      ) : hasError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID}
          error={getApptError}
          onTryAgain={refetchAppointments}
        />
      ) : isPhoneAppointment ? (
        <PhoneAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : isInPersonVAAppointment ? (
        <InPersonVAAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : isClaimExamAppointment ? (
        <ClaimExamAppointment
          appointmentID={trueAppointment?.id || ''}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
          cancelAppointment={cancelAppointment}
        />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <AppointmentAlert attributes={attributes} />
          <TextArea>
            <AppointmentTypeAndDate attributes={attributes} isPastAppointment={false} />
            {renderAddToCalendarLink()}

            {renderVideoAppointmentInstructions()}

            {renderAtHomeVideoConnectAppointmentData()}
            <TypeOfCare attributes={attributes} />
            <ProviderName attributes={attributes} />
            <ClinicNameAndPhysicalLocation attributes={attributes} />
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
            <PendingAppointmentCancelButton
              attributes={attributes}
              appointmentID={trueAppointment?.id}
              cancelAppointment={cancelAppointment}
              goBack={navigation.goBack}
            />
          </TextArea>

          {readerCancelInformation()}
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default UpcomingAppointmentDetails

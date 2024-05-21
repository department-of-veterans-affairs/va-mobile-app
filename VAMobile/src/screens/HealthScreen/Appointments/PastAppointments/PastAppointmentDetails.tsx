import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { AppointmentAttributes, AppointmentData, AppointmentStatusConstants, AppointmentTypeConstants } from 'api/types'
import { Box, ClickToCallPhoneNumber, FeatureLandingTemplate, LinkWithAnalytics, TextArea, TextView } from 'components'
import { Events, UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'
import { registerReviewEvent } from 'utils/inAppReviews'

import {
  AppointmentDetailsSubTypeConstants,
  getAppointmentAnalyticsDays,
  getAppointmentAnalyticsStatus,
  isAPendingAppointment,
} from '../../../../utils/appointments'
import { HealthStackParamList } from '../../HealthStackScreens'
import {
  AppointmentAddressAndNumber,
  AppointmentAlert,
  AppointmentReason,
  AppointmentTypeAndDate,
  ContactInformation,
  PreferredAppointmentType,
  PreferredDateAndTime,
  ProviderName,
  TypeOfCare,
} from '../AppointmentDetailsCommon'
import ClinicNameAndPhysicalLocation from '../AppointmentDetailsCommon/ClinicNameAndPhysicalLocation'
import { InPersonVAAppointment, PhoneAppointment } from '../AppointmentTypeComponents'

type PastAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'PastAppointmentDetails'>
const { LINK_URL_VA_SCHEDULING } = getEnv()

function PastAppointmentDetails({ route, navigation }: PastAppointmentDetailsProps) {
  const { appointment } = route.params

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, status, phoneOnly, location, serviceCategoryName } =
    attributes || ({} as AppointmentAttributes)
  const appointmentIsCanceled = status === AppointmentStatusConstants.CANCELLED
  const pendingAppointment = isAPendingAppointment(attributes)

  useEffect(() => {
    if (attributes) {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_appointments())
      logAnalyticsEvent(
        Events.vama_appt_view_details(
          !!pendingAppointment,
          appointment.id,
          getAppointmentAnalyticsStatus(attributes),
          attributes.appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
        ),
      )
      registerReviewEvent()
    }
  }, [appointment, pendingAppointment, attributes])

  const appointmentTypeAndDateIsLastItem =
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE ||
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME ||
    appointmentIsCanceled

  function renderScheduleAnotherAppointment() {
    if (pendingAppointment) {
      return <></>
    }

    if (
      phoneOnly ||
      (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION')
    ) {
      const title = appointmentIsCanceled ? t('appointments.reschedule.title') : t('appointments.schedule.title')
      const body = appointmentIsCanceled ? t('appointments.reschedule.body') : t('appointments.schedule.body')

      return (
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextArea>
            <TextView
              variant="MobileBodyBold"
              accessibilityRole="header"
              accessibilityLabel={a11yLabelVA(title)}
              mb={theme.dimensions.condensedMarginBetween}>
              {title}
            </TextView>
            <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(body)} paragraphSpacing={true}>
              {body}
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
      )
    }

    return (
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView
            variant="MobileBody"
            accessibilityLabel={a11yLabelVA(t('pastAppointmentDetails.toScheduleAnotherAppointment'))}>
            {t('pastAppointmentDetails.toScheduleAnotherAppointment')}
          </TextView>
        </TextArea>
      </Box>
    )
  }

  const isInPersonVAAppointment =
    appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION'
  const isPhoneAppointment = phoneOnly

  const subType =
    appointmentIsCanceled && pendingAppointment
      ? AppointmentDetailsSubTypeConstants.CanceledAndPending
      : appointmentIsCanceled
        ? AppointmentDetailsSubTypeConstants.Canceled
        : pendingAppointment
          ? AppointmentDetailsSubTypeConstants.PastPending
          : AppointmentDetailsSubTypeConstants.Past

  return (
    <FeatureLandingTemplate backLabel={t('appointments')} backLabelOnPress={navigation.goBack} title={t('details')}>
      {isPhoneAppointment ? (
        <PhoneAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : isInPersonVAAppointment ? (
        <InPersonVAAppointment
          appointmentID={appointment.id}
          attributes={attributes}
          subType={subType}
          goBack={navigation.goBack}
        />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <AppointmentAlert attributes={attributes} />
          <TextArea>
            <Box mb={appointmentTypeAndDateIsLastItem ? 0 : theme.dimensions.standardMarginBetween}>
              <AppointmentTypeAndDate attributes={attributes} isPastAppointment={true} />
            </Box>
            <TypeOfCare attributes={attributes} />
            <ProviderName attributes={attributes} />
            <ClinicNameAndPhysicalLocation attributes={attributes} />
            <AppointmentAddressAndNumber attributes={attributes} isPastAppointment={true} />

            <PreferredDateAndTime attributes={attributes} />
            <PreferredAppointmentType attributes={attributes} />
            <AppointmentReason attributes={attributes} />
            <ContactInformation attributes={attributes} />
          </TextArea>

          {renderScheduleAnotherAppointment()}
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default PastAppointmentDetails

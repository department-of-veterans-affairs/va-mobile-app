import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes, AppointmentData, AppointmentLocation, AppointmentTypeConstants, AppointmentTypeToA11yLabel } from 'store/api/types'
import { Box, ButtonTypesConstants, ClickForActionLink, ClickToCallPhoneNumber, LinkButtonProps, LinkTypeOptionsConstants, TextArea, TextView, VAButton } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { cancelAppointment } from 'store/slices'
import { getAppointmentAnalyticsDays, getAppointmentAnalyticsStatus } from 'utils/appointments'
import { getTranslation } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDestructiveActionSheet, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type AppointmentCancellationInfoProps = {
  appointment?: AppointmentData
  goBack?: () => void
}

const AppointmentCancellationInfo: FC<AppointmentCancellationInfoProps> = ({ appointment }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const confirmAlert = useDestructiveActionSheet()
  const dispatch = useAppDispatch()

  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, location, isCovidVaccine, cancelId, serviceCategoryName } = attributes || ({} as AppointmentAttributes)
  const { name, phone } = location || ({} as AppointmentLocation)

  const findYourVALocationProps: LinkButtonProps = {
    displayedText: t('upcomingAppointmentDetails.findYourVALocation'),
    linkType: LinkTypeOptionsConstants.externalLink,
    numberOrUrlLink: WEBVIEW_URL_FACILITY_LOCATOR,
    a11yLabel: a11yLabelVA(t('upcomingAppointmentDetails.findYourVALocation')),
    accessibilityHint: t('upcomingAppointmentDetails.findYourVALocation.a11yHint'),
  }

  let title
  let titleA11yLabel
  let body
  let bodyA11yLabel

  if (isCovidVaccine) {
    title = t('upcomingAppointmentDetails.cancelCovidVaccineAppointment.title')
    titleA11yLabel = a11yLabelVA(t('upcomingAppointmentDetails.cancelCovidVaccineAppointment.title'))
    body = t('upcomingAppointmentDetails.cancelCovidVaccineAppointment.body')
    bodyA11yLabel = a11yLabelVA(t('upcomingAppointmentDetails.cancelCovidVaccineAppointment.body'))
  } else {
    switch (appointmentType) {
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
        title = t('upcomingAppointmentDetails.doYouNeedToCancel')
        body = t('upcomingAppointmentDetails.cancelUncancellableAppointment.body', { appointmentType: getTranslation(AppointmentTypeToA11yLabel[appointmentType], t) })
        bodyA11yLabel = a11yLabelVA(
          t('upcomingAppointmentDetails.cancelUncancellableAppointment.body', { appointmentType: getTranslation(AppointmentTypeToA11yLabel[appointmentType], t) }),
        )
        break
      case AppointmentTypeConstants.COMMUNITY_CARE:
        title = t('upcomingAppointmentDetails.doYouNeedToCancel')
        body = t('upcomingAppointmentDetails.cancelCommunityCareAppointment.body')
        break
      case AppointmentTypeConstants.VA:
        if (cancelId) {
          title = t('upcomingAppointmentDetails.cancelVAAppointment.title')
          body = t('upcomingAppointmentDetails.cancelVAAppointment.body')
        } else if (serviceCategoryName === 'COMPENSATION & PENSION') {
          title = t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule')
          body = t('upcomingAppointmentDetails.cancelCompensationAndPension.body', { facility: name })
        } else {
          title = t('upcomingAppointmentDetails.doYouNeedToCancel')
          body = t('upcomingAppointmentDetails.cancelUncancellableAppointment.body.alternative')
          bodyA11yLabel = a11yLabelVA(t('upcomingAppointmentDetails.cancelUncancellableAppointment.body.alternative'))
        }
        break
      default:
        if (cancelId) {
          title = t('upcomingAppointmentDetails.cancelVAAppointment.title')
          body = t('upcomingAppointmentDetails.cancelVAAppointment.body')
        } else {
          title = t('upcomingAppointmentDetails.doYouNeedToCancel')
          body = t('upcomingAppointmentDetails.cancelUncancellableAppointment.body.alternative')
          bodyA11yLabel = a11yLabelVA(t('upcomingAppointmentDetails.cancelUncancellableAppointment.body.alternative'))
        }
        break
    }
  }

  const linkOrPhone = phone ? (
    <ClickToCallPhoneNumber phone={phone} />
  ) : (
    <Box mt={theme.dimensions.standardMarginBetween}>
      <ClickForActionLink {...findYourVALocationProps} />
    </Box>
  )

  const onCancelAppointment = () => {
    logAnalyticsEvent(
      Events.vama_apt_cancel_clicks(appointment?.id || '', getAppointmentAnalyticsStatus(attributes), appointmentType.toString(), getAppointmentAnalyticsDays(attributes), 'start'),
    )

    const onPress = () => {
      logAnalyticsEvent(
        Events.vama_apt_cancel_clicks(
          appointment?.id || '',
          getAppointmentAnalyticsStatus(attributes),
          appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
          'confirm',
        ),
      )
      dispatch(
        cancelAppointment(cancelId, appointment?.id, undefined, getAppointmentAnalyticsStatus(attributes), appointmentType.toString(), getAppointmentAnalyticsDays(attributes)),
      )
    }

    confirmAlert({
      title: t('appointments.cancelThisAppointment'),
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      buttons: [
        {
          text: t('appointments.cancelAppointment'),
          onPress: onPress,
        },
        {
          text: t('appointments.keepAppointment'),
        },
      ],
    })
  }

  return (
    <TextArea>
      <TextView variant="MobileBodyBold" accessibilityRole="header" {...testIdProps(titleA11yLabel || title)}>
        {title}
      </TextView>
      <TextView variant="MobileBody" {...testIdProps(bodyA11yLabel || body)} mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
        {body}
      </TextView>
      {appointmentType === AppointmentTypeConstants.VA && !isCovidVaccine && cancelId ? (
        <VAButton
          onPress={onCancelAppointment}
          label={t('upcomingAppointmentDetails.cancelAppointment')}
          buttonType={ButtonTypesConstants.buttonDestructive}
          {...testIdProps(t('upcomingAppointmentDetails.cancelAppointment'))}
        />
      ) : (
        <>
          {serviceCategoryName === 'COMPENSATION & PENSION' ? (
            <></>
          ) : (
            <>
              <TextView variant="MobileBodyBold" accessibilityRole="header" {...testIdProps(name)}>
                {name}
              </TextView>
              {linkOrPhone}
            </>
          )}
        </>
      )}
    </TextArea>
  )
}

export default AppointmentCancellationInfo

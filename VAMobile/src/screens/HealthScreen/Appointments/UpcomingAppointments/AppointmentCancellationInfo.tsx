import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { UseMutateFunction } from '@tanstack/react-query'

import {
  AppointmentAttributes,
  AppointmentData,
  AppointmentLocation,
  AppointmentTypeConstants,
  AppointmentTypeToA11yLabel,
} from 'api/types'
import { Box, ClickToCallPhoneNumber, LinkWithAnalytics, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { testIdProps } from 'utils/accessibility'
import { logAnalyticsEvent } from 'utils/analytics'
import { getAppointmentAnalyticsDays, getAppointmentAnalyticsStatus } from 'utils/appointments'
import { showSnackBar } from 'utils/common'
import getEnv from 'utils/env'
import { getTranslation } from 'utils/formattingUtils'
import { useAppDispatch, useDestructiveActionSheet, useTheme } from 'utils/hooks'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type AppointmentCancellationInfoProps = {
  appointment?: AppointmentData
  goBack: () => void
  cancelAppointment: UseMutateFunction<unknown, Error, string, unknown>
}

function AppointmentCancellationInfo({ appointment, goBack, cancelAppointment }: AppointmentCancellationInfoProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const confirmAlert = useDestructiveActionSheet()

  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, location, isCovidVaccine, cancelId, serviceCategoryName, phoneOnly } =
    attributes || ({} as AppointmentAttributes)
  const { name, phone } = location || ({} as AppointmentLocation)

  let title
  let titleA11yLabel
  let body
  let bodyA11yLabel

  if (
    phoneOnly ||
    (appointmentType === AppointmentTypeConstants.VA &&
      serviceCategoryName !== 'COMPENSATION & PENSION' &&
      !isCovidVaccine)
  ) {
    title = t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule')
    body =
      appointmentType === AppointmentTypeConstants.VA && !isCovidVaccine && cancelId
        ? t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.inAppCancel.body')
        : t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.noAppCancel.body')
  } else if (isCovidVaccine) {
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
        body = t('upcomingAppointmentDetails.cancelUncancellableAppointment.body', {
          appointmentType: getTranslation(AppointmentTypeToA11yLabel[appointmentType], t),
        })
        bodyA11yLabel = a11yLabelVA(
          t('upcomingAppointmentDetails.cancelUncancellableAppointment.body', {
            appointmentType: getTranslation(AppointmentTypeToA11yLabel[appointmentType], t),
          }),
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

  const linkOrPhone =
    phone && phone.areaCode && phone.number ? (
      <ClickToCallPhoneNumber phone={phone} />
    ) : (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <LinkWithAnalytics
          type="url"
          url={WEBVIEW_URL_FACILITY_LOCATOR}
          text={t('upcomingAppointmentDetails.findYourVALocation')}
          a11yLabel={a11yLabelVA(t('upcomingAppointmentDetails.findYourVALocation'))}
          a11yHint={t('upcomingAppointmentDetails.findYourVALocation.a11yHint')}
        />
      </Box>
    )

  const onCancelAppointment = () => {
    logAnalyticsEvent(
      Events.vama_apt_cancel_click(
        appointment?.id || '',
        getAppointmentAnalyticsStatus(attributes),
        appointmentType.toString(),
        getAppointmentAnalyticsDays(attributes),
        'start',
      ),
    )

    const onPress = () => {
      logAnalyticsEvent(
        Events.vama_apt_cancel_click(
          appointment?.id || '',
          getAppointmentAnalyticsStatus(attributes),
          appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
          'confirm',
        ),
      )
      if (cancelId) {
        const mutateOptions = {
          onSuccess: () => {
            goBack()
            showSnackBar(t('appointments.appointmentCanceled'), dispatch, undefined, true, false, true)
            logAnalyticsEvent(
              Events.vama_appt_cancel(
                false,
                appointment?.id,
                getAppointmentAnalyticsStatus(attributes),
                attributes.appointmentType.toString(),
                getAppointmentAnalyticsDays(attributes),
              ),
            )
          },
        }
        cancelAppointment(cancelId, mutateOptions)
      }
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
      <TextView
        variant="MobileBody"
        {...testIdProps(bodyA11yLabel || body)}
        mt={theme.dimensions.standardMarginBetween}
        paragraphSpacing={true}
        testID="upcomingApptCancellationTestID">
        {body}
      </TextView>
      {(appointmentType === AppointmentTypeConstants.VA || phoneOnly) && !isCovidVaccine && cancelId ? (
        <>
          {(phoneOnly ||
            (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION')) &&
            linkOrPhone}
          <Box
            mt={
              phoneOnly ||
              (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION')
                ? theme.dimensions.standardMarginBetween
                : undefined
            }>
            <Button
              onPress={onCancelAppointment}
              label={t('upcomingAppointmentDetails.cancelAppointment')}
              buttonType={ButtonVariants.Destructive}
              testID={t('upcomingAppointmentDetails.cancelAppointment')}
            />
          </Box>
        </>
      ) : (
        <>
          {serviceCategoryName === 'COMPENSATION & PENSION' ? (
            <></>
          ) : (
            <>
              {phoneOnly ? undefined : (
                <TextView variant="MobileBodyBold" accessibilityRole="header" {...testIdProps(name)}>
                  {name}
                </TextView>
              )}
              {linkOrPhone}
            </>
          )}
        </>
      )}
    </TextArea>
  )
}

export default AppointmentCancellationInfo

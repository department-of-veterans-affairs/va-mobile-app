import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { UseMutateFunction } from '@tanstack/react-query'
import { TFunction } from 'i18next'

import { AppointmentAttributes } from 'api/types'
import { Box, BoxProps, ClickToCallPhoneNumber, LinkWithAnalytics, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { AppDispatch } from 'store'
import { VATheme } from 'styles/theme'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
  getAppointmentAnalyticsDays,
  getAppointmentAnalyticsStatus,
} from 'utils/appointments'
import { showSnackBar } from 'utils/common'
import getEnv from 'utils/env'
import { useAppDispatch, useDestructiveActionSheet, useDestructiveActionSheetProps, useTheme } from 'utils/hooks'

const { LINK_URL_VA_SCHEDULING, WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type AppointmentCancelRescheduleProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
  goBack: () => void
  cancelAppointment?: UseMutateFunction<unknown, Error, string, unknown>
}

const cancelButton = (
  pendingAppointment: boolean,
  appointmentID: string,
  attributes: AppointmentAttributes,
  goBack: () => void,
  t: TFunction,
  theme: VATheme,
  dispatch: AppDispatch,
  confirmAlert: (props: useDestructiveActionSheetProps) => void,
  cancelId?: string,
  cancelAppointment?: UseMutateFunction<unknown, Error, string, unknown>,
) => {
  const onPress = () => {
    logAnalyticsEvent(
      Events.vama_apt_cancel_click(
        appointmentID || '',
        getAppointmentAnalyticsStatus(attributes),
        attributes.appointmentType.toString(),
        getAppointmentAnalyticsDays(attributes),
        'confirm',
      ),
    )
    if (cancelId && cancelAppointment) {
      const mutateOptions = {
        onSuccess: () => {
          goBack()
          showSnackBar(
            pendingAppointment ? t('appointments.requestCanceled') : t('appointments.appointmentCanceled'),
            dispatch,
            undefined,
            true,
            false,
            true,
          )
          logAnalyticsEvent(
            Events.vama_appt_cancel(
              pendingAppointment,
              appointmentID,
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

  const onCancel = () => {
    logAnalyticsEvent(
      Events.vama_apt_cancel_click(
        appointmentID || '',
        getAppointmentAnalyticsStatus(attributes),
        attributes.appointmentType.toString(),
        getAppointmentAnalyticsDays(attributes),
        'start',
      ),
    )
    confirmAlert({
      title: pendingAppointment ? t('appointments.cancelRequest') : t('appointments.cancelThisAppointment'),
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      buttons: [
        {
          text: pendingAppointment ? t('cancelRequest') : t('appointments.cancelAppointment'),
          onPress: onPress,
        },
        {
          text: pendingAppointment ? t('keepRequest') : t('appointments.keepAppointment'),
        },
      ],
    })
  }

  return (
    <Box mt={theme.dimensions.standardMarginBetween}>
      <Button
        onPress={onCancel}
        label={pendingAppointment ? t('cancelRequest') : t('upcomingAppointmentDetails.cancelAppointment')}
        a11yHint={
          pendingAppointment
            ? t('appointments.pending.cancelRequest.a11yHint')
            : t('appointments.cancelThisAppointment')
        }
        buttonType={ButtonVariants.Destructive}
        testID={pendingAppointment ? t('cancelRequest') : t('upcomingAppointmentDetails.cancelAppointment')}
      />
    </Box>
  )
}

function AppointmentCancelReschedule({
  appointmentID,
  attributes,
  subType,
  type,
  goBack,
  cancelAppointment,
}: AppointmentCancelRescheduleProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const confirmAlert = useDestructiveActionSheet()
  const { location, cancelId } = attributes || ({} as AppointmentAttributes)
  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderBottomWidth: 'default',
    borderBottomColor: 'primary',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
    height: theme.dimensions.standardMarginBetween,
    backgroundColor: 'main',
    mx: -theme.dimensions.gutter,
  }

  switch (type) {
    case AppointmentDetailsTypeConstants.InPersonVA:
      switch (subType) {
        case AppointmentDetailsSubTypeConstants.PastPending:
          return <></>
        case AppointmentDetailsSubTypeConstants.Pending:
          return cancelButton(
            true,
            appointmentID,
            attributes,
            goBack,
            t,
            theme,
            dispatch,
            confirmAlert,
            cancelId,
            cancelAppointment,
          )
        case AppointmentDetailsSubTypeConstants.CanceledAndPending:
          return (
            <Box>
              <Box {...boxProps} />
              <TextView
                variant="MobileBodyBold"
                accessibilityRole="header"
                mt={theme.dimensions.standardMarginBetween}
                mb={theme.dimensions.condensedMarginBetween}>
                {t('appointments.reschedule.pending.title')}
              </TextView>
              <TextView
                variant="MobileBody"
                mb={theme.dimensions.condensedMarginBetween}
                accessibilityLabel={a11yLabelVA(t('appointments.reschedule.pending.body'))}>
                {t('appointments.reschedule.pending.body')}
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
            </Box>
          )
        case AppointmentDetailsSubTypeConstants.Canceled:
          return (
            <Box>
              <Box {...boxProps} />
              <TextView
                variant="MobileBodyBold"
                accessibilityRole="header"
                mt={theme.dimensions.standardMarginBetween}
                mb={theme.dimensions.condensedMarginBetween}>
                {t('appointments.reschedule.title')}
              </TextView>
              <TextView
                variant="MobileBody"
                mb={theme.dimensions.condensedMarginBetween}
                accessibilityLabel={a11yLabelVA(t('appointments.reschedule.body'))}>
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
            </Box>
          )
        case AppointmentDetailsSubTypeConstants.Past:
          return (
            <Box>
              <Box {...boxProps} />
              <TextView
                variant="MobileBodyBold"
                accessibilityRole="header"
                mt={theme.dimensions.standardMarginBetween}
                mb={theme.dimensions.condensedMarginBetween}>
                {t('appointments.schedule.title')}
              </TextView>
              <TextView
                variant="MobileBody"
                mb={theme.dimensions.condensedMarginBetween}
                accessibilityLabel={a11yLabelVA(t('appointments.schedule.body'))}>
                {t('appointments.schedule.body')}
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
            </Box>
          )
        case AppointmentDetailsSubTypeConstants.Upcoming:
          return (
            <Box>
              <Box {...boxProps} />
              <TextView
                variant="MobileBodyBold"
                accessibilityRole="header"
                mt={theme.dimensions.standardMarginBetween}
                mb={theme.dimensions.condensedMarginBetween}>
                {t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule')}
              </TextView>
              <TextView
                variant="MobileBody"
                mb={theme.dimensions.condensedMarginBetween}
                testID="upcomingApptCancellationTestID">
                {cancelId
                  ? t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.inAppCancel.body')
                  : t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.noAppCancel.body')}
              </TextView>
              {location?.phone && location.phone.areaCode && location.phone.number ? (
                <ClickToCallPhoneNumber phone={location.phone} />
              ) : (
                <LinkWithAnalytics
                  type="url"
                  url={WEBVIEW_URL_FACILITY_LOCATOR}
                  text={t('upcomingAppointmentDetails.findYourVALocation')}
                  a11yLabel={a11yLabelVA(t('upcomingAppointmentDetails.findYourVALocation'))}
                  a11yHint={t('upcomingAppointmentDetails.findYourVALocation.a11yHint')}
                />
              )}
              {cancelId &&
                cancelButton(
                  false,
                  appointmentID,
                  attributes,
                  goBack,
                  t,
                  theme,
                  dispatch,
                  confirmAlert,
                  cancelId,
                  cancelAppointment,
                )}
            </Box>
          )
      }
      return <></>
    default:
      return <></>
  }
}

export default AppointmentCancelReschedule

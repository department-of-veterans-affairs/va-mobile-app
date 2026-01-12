import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { MutateOptions } from '@tanstack/react-query'
import { TFunction } from 'i18next'

import { AppointmentAttributes, AppointmentLocation } from 'api/types'
import { Box, ClickToCallPhoneNumber, LinkWithAnalytics, TextAreaSpacer, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
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
import getEnv from 'utils/env'
import { ActionSheetProps, useShowActionSheet, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

const { LINK_URL_VA_SCHEDULING, WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type AppointmentCancelRescheduleProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
  goBack: () => void
  cancelAppointment?: (cancelID: string, mutateOptions: MutateOptions<unknown, Error, string, unknown>) => void
}

const cancelButton = (
  pendingAppointment: boolean,
  appointmentID: string,
  attributes: AppointmentAttributes,
  goBack: () => void,
  t: TFunction,
  theme: VATheme,
  snackbar: ReturnType<typeof useSnackbar>,
  confirmAlert: (options: ActionSheetProps, callback: (i?: number) => void | Promise<void>) => void,
  cancelId?: string,
  cancelAppointment?: (cancelID: string, mutateOptions: MutateOptions<unknown, Error, string, unknown>) => void,
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
          snackbar.show(pendingAppointment ? t('appointments.requestCanceled') : t('appointments.appointmentCanceled'))
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
        onError: () => {
          snackbar.show(
            pendingAppointment ? t('appointments.requestNotCanceled') : t('appointments.appointmentNotCanceled'),
            { isError: true, onActionPressed: () => cancelAppointment(cancelId, mutateOptions) },
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

    const keepText = pendingAppointment ? t('keepRequest') : t('appointments.keepAppointment')
    const cancelText = pendingAppointment ? t('cancelRequest') : t('appointments.cancelAppointment')
    const options = [cancelText, keepText]
    confirmAlert(
      {
        options,
        title: pendingAppointment ? t('appointments.cancelRequest') : t('appointments.cancelThisAppointment'),
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            onPress()
            break
        }
      },
    )
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

const phoneFacilitySchedulingLink = (
  useFacilityLocatorFallback: boolean,
  isGFEAtlasHomeVideo: boolean,
  location: AppointmentLocation | undefined,
  showScheduleLink: boolean,
  t: TFunction,
  theme: VATheme,
) => {
  return (
    <Box>
      {location?.name && isGFEAtlasHomeVideo && (
        <TextView mt={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {location.name}
        </TextView>
      )}
      {location?.phone && location.phone.areaCode && location.phone.number ? (
        <ClickToCallPhoneNumber phone={location.phone} />
      ) : useFacilityLocatorFallback ? (
        <LinkWithAnalytics
          type="url"
          url={WEBVIEW_URL_FACILITY_LOCATOR}
          text={t('upcomingAppointmentDetails.findYourVALocation')}
          a11yLabel={a11yLabelVA(t('upcomingAppointmentDetails.findYourVALocation'))}
          a11yHint={t('upcomingAppointmentDetails.findYourVALocation.a11yHint')}
        />
      ) : undefined}
      {featureEnabled('rescheduleLink') && showScheduleLink && !useFacilityLocatorFallback && (
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_VA_SCHEDULING}
          text={t('appointments.vaSchedule')}
          a11yLabel={a11yLabelVA(t('appointments.vaSchedule'))}
          testID="vaLinkApptsCancelTestID"
        />
      )}
    </Box>
  )
}

const getHeader = (subType: AppointmentDetailsSubType, t: TFunction) => {
  switch (subType) {
    case AppointmentDetailsSubTypeConstants.Canceled:
      return t('appointments.reschedule.title')
    case AppointmentDetailsSubTypeConstants.Past:
      return t('appointments.schedule.title')
    case AppointmentDetailsSubTypeConstants.Upcoming:
      return t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule')
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
      return t('appointments.reschedule.pending.title')
  }
  return ''
}

const getBody = (
  cancelId: string | undefined,
  location: AppointmentLocation | undefined,
  subType: AppointmentDetailsSubType,
  type: AppointmentDetailsScreenType,
  t: TFunction,
) => {
  switch (subType) {
    case AppointmentDetailsSubTypeConstants.Canceled:
      switch (type) {
        case AppointmentDetailsTypeConstants.InPersonVA:
        case AppointmentDetailsTypeConstants.Phone:
        case AppointmentDetailsTypeConstants.VideoVA:
          return t('appointments.reschedule.body')
        case AppointmentDetailsTypeConstants.VideoGFE:
        case AppointmentDetailsTypeConstants.VideoAtlas:
        case AppointmentDetailsTypeConstants.VideoHome:
          return t('appointments.rescheduleVideoNonVA.body')
        case AppointmentDetailsTypeConstants.ClaimExam:
          return t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.claimExam.body', {
            facilityName: location?.name || t('prescription.details.vaFacilityHeader'),
          })
        case AppointmentDetailsTypeConstants.CommunityCare:
          return t('appointments.rescheduleCommunityCare.body')
      }
      break
    case AppointmentDetailsSubTypeConstants.Past:
      switch (type) {
        case AppointmentDetailsTypeConstants.InPersonVA:
        case AppointmentDetailsTypeConstants.Phone:
        case AppointmentDetailsTypeConstants.VideoVA:
          return t('appointments.schedule.body')
        case AppointmentDetailsTypeConstants.VideoGFE:
        case AppointmentDetailsTypeConstants.VideoAtlas:
        case AppointmentDetailsTypeConstants.VideoHome:
          return t('appointments.scheduleVideoNonVA.body')
        case AppointmentDetailsTypeConstants.CommunityCare:
          return t('appointments.scheduleCommunityCare.body')
      }
      break
    case AppointmentDetailsSubTypeConstants.Upcoming:
      switch (type) {
        case AppointmentDetailsTypeConstants.InPersonVA:
        case AppointmentDetailsTypeConstants.Phone:
          return cancelId
            ? t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.inAppCancel.body')
            : t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.noAppCancel.body')
        case AppointmentDetailsTypeConstants.VideoVA:
          return t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.noAppCancel.body')
        case AppointmentDetailsTypeConstants.VideoGFE:
        case AppointmentDetailsTypeConstants.VideoAtlas:
        case AppointmentDetailsTypeConstants.VideoHome:
          return t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.videoNonVA.body')
        case AppointmentDetailsTypeConstants.ClaimExam:
          return t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.claimExam.body', {
            facilityName: location?.name || t('prescription.details.vaFacilityHeader'),
          })
        case AppointmentDetailsTypeConstants.CommunityCare:
          return t('upcomingAppointmentDetails.doYouNeedToCancelOrReschedule.noAppCancelCommunityCare.body')
      }
      break
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
      return t('appointments.reschedule.pending.body')
  }
  return ''
}

const getIsGFEAtlasHomeVideo = (subType: AppointmentDetailsSubType, type: AppointmentDetailsScreenType) => {
  if (subType === AppointmentDetailsSubTypeConstants.CanceledAndPending) {
    return false
  }

  switch (type) {
    case AppointmentDetailsTypeConstants.VideoGFE:
    case AppointmentDetailsTypeConstants.VideoAtlas:
    case AppointmentDetailsTypeConstants.VideoHome:
      return true
  }

  return false
}

function AppointmentCancelReschedule({
  appointmentID,
  attributes,
  subType,
  type,
  goBack,
  cancelAppointment,
}: AppointmentCancelRescheduleProps) {
  const snackbar = useSnackbar()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const confirmAlert = useShowActionSheet()
  const { location, cancelId, showScheduleLink } = attributes || ({} as AppointmentAttributes)

  const header = getHeader(subType, t)
  const body = getBody(cancelId, location, subType, type, t)
  const isAtlastGFEHomeVideoAppt = getIsGFEAtlasHomeVideo(subType, type)
  const isClaimExam = type === AppointmentDetailsTypeConstants.ClaimExam
  const useFacilityFallback = subType === AppointmentDetailsSubTypeConstants.Upcoming

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.PastPending:
      return <></>
    case AppointmentDetailsSubTypeConstants.Pending:
      return cancelId ? (
        cancelButton(
          true,
          appointmentID,
          attributes,
          goBack,
          t,
          theme,
          snackbar,
          confirmAlert,
          cancelId,
          cancelAppointment,
        )
      ) : (
        <></>
      )
    case AppointmentDetailsSubTypeConstants.Past:
      if (isClaimExam) {
        return <></>
      }
  }

  return (
    <Box>
      <TextAreaSpacer />
      <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.standardMarginBetween}>
        {header}
      </TextView>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView
        variant="MobileBody"
        mb={theme.dimensions.condensedMarginBetween}
        accessibilityLabel={a11yLabelVA(body)}>
        {body}
      </TextView>
      {!isClaimExam ? (
        phoneFacilitySchedulingLink(
          useFacilityFallback,
          isAtlastGFEHomeVideoAppt,
          location,
          !!showScheduleLink,
          t,
          theme,
        )
      ) : featureEnabled('rescheduleLink') &&
        showScheduleLink &&
        subType === AppointmentDetailsSubTypeConstants.CanceledAndPending ? (
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_VA_SCHEDULING}
          text={t('appointments.vaSchedule')}
          a11yLabel={a11yLabelVA(t('appointments.vaSchedule'))}
        />
      ) : undefined}
      {cancelId &&
        subType === AppointmentDetailsSubTypeConstants.Upcoming &&
        (type === AppointmentDetailsTypeConstants.InPersonVA || type === AppointmentDetailsTypeConstants.Phone) &&
        cancelButton(
          false,
          appointmentID,
          attributes,
          goBack,
          t,
          theme,
          snackbar,
          confirmAlert,
          cancelId,
          cancelAppointment,
        )}
    </Box>
  )
}

export default AppointmentCancelReschedule

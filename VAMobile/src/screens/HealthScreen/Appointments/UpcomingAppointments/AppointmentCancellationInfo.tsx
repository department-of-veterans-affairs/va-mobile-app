import { useRouteNavigation } from 'utils/hooks'
import React, { FC } from 'react'

import { AppointmentAttributes, AppointmentData, AppointmentLocation, AppointmentTypeConstants, AppointmentTypeToA11yLabel, AppointmentTypeToID } from 'store/api/types'
import {
  Box,
  ButtonTypesConstants,
  ClickForActionLink,
  ClickToCallPhoneNumber,
  LinkButtonProps,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  TextArea,
  TextView,
  VAButton,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type AppointmentCancellationInfoProps = {
  appointment?: AppointmentData
}

const AppointmentCancellationInfo: FC<AppointmentCancellationInfoProps> = ({ appointment }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, location } = attributes || ({} as AppointmentAttributes)
  const { name, phone } = location || ({} as AppointmentLocation)

  const findYourVALocationProps: LinkButtonProps = {
    displayedText: t('upcomingAppointmentDetails.findYourVALocation'),
    linkType: LinkTypeOptionsConstants.url,
    linkUrlIconType: LinkUrlIconType.Arrow,
    numberOrUrlLink: WEBVIEW_URL_FACILITY_LOCATOR,
    testID: t('upcomingAppointmentDetails.findYourVALocation.a11yLabel'),
    accessibilityHint: t('upcomingAppointmentDetails.findYourVALocation.a11yHint'),
  }

  let title
  let titleA11yLabel
  let body
  let bodyA11yLabel

  switch (appointmentType) {
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
      title = t('upcomingAppointmentDetails.doYouNeedToCancel')
      body = t('upcomingAppointmentDetails.cancelUncancellableAppointment.body', { appointmentType: t(AppointmentTypeToID[appointmentType]) })
      bodyA11yLabel = t('upcomingAppointmentDetails.cancelUncancellableAppointment.body.A11yLabel', { appointmentType: t(AppointmentTypeToA11yLabel[appointmentType]) })
      break
    case AppointmentTypeConstants.COMMUNITY_CARE:
      title = t('upcomingAppointmentDetails.doYouNeedToCancel')
      body = t('upcomingAppointmentDetails.cancelCommunityCareAppointment.body')
      break
    case AppointmentTypeConstants.VA:
      title = t('upcomingAppointmentDetails.cancelVAAppointment.title')
      body = t('upcomingAppointmentDetails.cancelVAAppointment.body')
      break
    default:
      title = t('upcomingAppointmentDetails.cancelVAAppointment.title')
      body = t('upcomingAppointmentDetails.cancelVAAppointment.body')
      break
  }

  const linkOrPhone = phone ? (
    <ClickToCallPhoneNumber phone={phone} />
  ) : (
    <Box mt={theme.dimensions.standardMarginBetween}>
      <ClickForActionLink {...findYourVALocationProps} />
    </Box>
  )

  const cancelAppointment = navigateTo('AppointmentCancellationConfirmation', { cancelID: appointment?.attributes?.cancelId, appointmentID: appointment?.id })

  return (
    <TextArea>
      <TextView variant="MobileBodyBold" accessibilityRole="header" {...testIdProps(titleA11yLabel || title)}>
        {title}
      </TextView>
      <TextView variant="MobileBody" {...testIdProps(bodyA11yLabel || body)} mt={theme.dimensions.standardMarginBetween}>
        {body}
      </TextView>
      {appointmentType === AppointmentTypeConstants.VA ? (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAButton
            onPress={cancelAppointment}
            label={t('upcomingAppointmentDetails.cancelAppointment')}
            a11yHint={t('upcomingAppointmentDetails.cancelAppointment.a11yHint')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            {...testIdProps(t('upcomingAppointmentDetails.cancelAppointment'))}
          />
        </Box>
      ) : (
        <>
          <TextView variant="MobileBodyBold" accessibilityRole="header" {...testIdProps(name)} mt={theme.dimensions.standardMarginBetween}>
            {name}
          </TextView>
          {linkOrPhone}
        </>
      )}
    </TextArea>
  )
}

export default AppointmentCancellationInfo

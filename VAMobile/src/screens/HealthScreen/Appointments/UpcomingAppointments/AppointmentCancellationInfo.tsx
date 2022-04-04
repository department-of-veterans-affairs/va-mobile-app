import React, { FC } from 'react'

import { AppointmentAttributes, AppointmentData, AppointmentLocation, AppointmentTypeConstants, AppointmentTypeToA11yLabel } from 'store/api/types'
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
import { cancelAppointment } from 'store/slices'
import { formatDateMMDDYYYY } from 'utils/formattingUtils'
import { isAndroid } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDestructiveAlert, useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type AppointmentCancellationInfoProps = {
  appointment?: AppointmentData
  goBack?: () => void
}

const AppointmentCancellationInfo: FC<AppointmentCancellationInfoProps> = ({ appointment }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const confirmAlert = useDestructiveAlert()
  const dispatch = useAppDispatch()
  const isAndroidDevice = isAndroid()

  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, location, isCovidVaccine, cancelId, startDateUtc } = attributes || ({} as AppointmentAttributes)
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

  if (isCovidVaccine) {
    title = t('upcomingAppointmentDetails.cancelCovidVaccineAppointment.title')
    body = t('upcomingAppointmentDetails.cancelCovidVaccineAppointment.body')
  } else {
    switch (appointmentType) {
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
        title = t('upcomingAppointmentDetails.doYouNeedToCancel')
        body = t('upcomingAppointmentDetails.cancelUncancellableAppointment.body', { appointmentType: t(AppointmentTypeToA11yLabel[appointmentType]) })
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
  }

  const linkOrPhone = phone ? (
    <ClickToCallPhoneNumber phone={phone} />
  ) : (
    <Box mt={theme.dimensions.standardMarginBetween}>
      <ClickForActionLink {...findYourVALocationProps} />
    </Box>
  )

  const onCancelAppointment = () => {
    const appointmentDate = formatDateMMDDYYYY(startDateUtc)
    const onPress = () => {
      dispatch(cancelAppointment(cancelId, appointment?.id))
    }

    const androidButtons = [
      {
        text: t('upcomingAppointmentDetails.cancelAppointment.android.noKeep'),
      },
      {
        text: t('upcomingAppointmentDetails.cancelAppointment.android.yesCancel'),
        onPress,
      },
    ]
    const iosButtons = [
      {
        text: t('common:cancel'),
      },
      {
        text: t('upcomingAppointmentDetails.cancelAppointment.yesCancelAppointment'),
        onPress,
      },
      {
        text: t('upcomingAppointmentDetails.cancelAppointment.noCancelAppointment'),
      },
    ]

    confirmAlert({
      title: '',
      message: t('upcomingAppointmentDetails.cancelAppointment.message', { appointmentDate }),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: isAndroidDevice ? androidButtons : iosButtons,
    })
  }

  return (
    <TextArea>
      <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header" {...testIdProps(titleA11yLabel || title)}>
        {title}
      </TextView>
      <TextView variant="MobileBody" {...testIdProps(bodyA11yLabel || body)} mt={theme.dimensions.standardMarginBetween}>
        {body}
      </TextView>
      {appointmentType === AppointmentTypeConstants.VA && !isCovidVaccine ? (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAButton
            onPress={onCancelAppointment}
            label={t('upcomingAppointmentDetails.cancelAppointment')}
            a11yHint={t('upcomingAppointmentDetails.cancelAppointment.a11yHint')}
            buttonType={ButtonTypesConstants.buttonDestructive}
            {...testIdProps(t('upcomingAppointmentDetails.cancelAppointment'))}
          />
        </Box>
      ) : (
        <>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header" {...testIdProps(name)} mt={theme.dimensions.standardMarginBetween}>
            {name}
          </TextView>
          {linkOrPhone}
        </>
      )}
    </TextArea>
  )
}

export default AppointmentCancellationInfo

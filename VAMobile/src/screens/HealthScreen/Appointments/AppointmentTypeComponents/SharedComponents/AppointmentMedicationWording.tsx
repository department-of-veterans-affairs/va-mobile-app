import React from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'

import { Box, LinkWithAnalytics, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const getWebViewLink = (onPress: () => void, t: TFunction) => (
  <LinkWithAnalytics
    type="custom"
    icon={{ name: 'Launch' }}
    onPress={onPress}
    text={t('appointmentsTab.medicationWording.whatToBringLink')}
  />
)

type AppointmentMedicationWordingProps = {
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

const { WEBVIEW_URL_WHAT_TO_BRING_TO_APPOINTMENTS } = getEnv()

function AppointmentMedicationWording({ subType, type }: AppointmentMedicationWordingProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const body = t('appointmentsTab.medicationWording.default.body')
  const theme = useTheme()

  const openWebviewLink = () => {
    navigateTo('Webview', {
      url: WEBVIEW_URL_WHAT_TO_BRING_TO_APPOINTMENTS,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('loading.vaWebsite'),
    })
  }

  const webViewLink = getWebViewLink(openWebviewLink, t)

  const getContent = () => {
    switch (type) {
      case AppointmentDetailsTypeConstants.InPersonVA:
      case AppointmentDetailsTypeConstants.Phone:
      case AppointmentDetailsTypeConstants.CommunityCare:
      case AppointmentDetailsTypeConstants.VideoVA:
        return (
          <>
            <TextView variant="MobileBody">{body}</TextView>
            {webViewLink}
          </>
        )
      case AppointmentDetailsTypeConstants.VideoAtlas:
      case AppointmentDetailsTypeConstants.VideoGFE:
      case AppointmentDetailsTypeConstants.VideoHome:
        return (
          <>
            <VABulletList listOfText={[body]} />
            {webViewLink}
            <VABulletList listOfText={[t('appointmentsTab.medicationWording.bullet2')]} />
            <LinkWithAnalytics
              type="custom"
              testID="prepareForVideoVisitTestID"
              text={t('appointmentsTab.medicationWording.howToSetUpDevice')}
              onPress={() => {
                navigateTo('PrepareForVideoVisit')
              }}
            />
          </>
        )
      default:
        return null
    }
  }

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.Upcoming:
    case AppointmentDetailsSubTypeConstants.Canceled:
      const content = getContent()
      if (!content) {
        return <></>
      }

      return (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appointmentsTab.medicationWording.title')}
          </TextView>
          {content}
        </Box>
      )
    default:
      return <></>
  }
}

export default AppointmentMedicationWording

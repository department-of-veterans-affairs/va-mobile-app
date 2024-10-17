import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type AppointmentMedicationWordingProps = {
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

const { WEBVIEW_URL_WHAT_TO_BRING_TO_APPOINTMENTS } = getEnv()

function AppointmentMedicationWording({ subType, type }: AppointmentMedicationWordingProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.Upcoming:
    case AppointmentDetailsSubTypeConstants.Canceled:
      switch (type) {
        case AppointmentDetailsTypeConstants.InPersonVA:
        case AppointmentDetailsTypeConstants.Phone:
        case AppointmentDetailsTypeConstants.CommunityCare:
        case AppointmentDetailsTypeConstants.VideoVA:
          const body = t('appointmentsTab.medicationWording.default.body')
          return (
            <Box mb={theme.dimensions.standardMarginBetween}>
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {t('appointmentsTab.medicationWording.title')}
              </TextView>
              <TextView variant="MobileBody">{body}</TextView>
              <LinkWithAnalytics
                type="custom"
                icon={{ name: 'Launch' }}
                onPress={() => {
                  navigateTo('Webview', {
                    url: WEBVIEW_URL_WHAT_TO_BRING_TO_APPOINTMENTS,
                    displayTitle: t('webview.vagov'),
                    loadingMessage: t('loading'),
                  })
                }}
                text={t('appointmentsTab.medicationWording.whatToBringLink')}
              />
            </Box>
          )
        default:
          return <></>
      }
    default:
      return <></>
  }
}

export default AppointmentMedicationWording

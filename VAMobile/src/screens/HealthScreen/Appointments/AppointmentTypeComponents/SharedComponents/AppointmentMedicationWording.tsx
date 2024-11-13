import React from 'react'
import { useTranslation } from 'react-i18next'

import { ParamListBase } from '@react-navigation/native'

import { TFunction } from 'i18next'

import { Box, LinkWithAnalytics, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import getEnv from 'utils/env'
import { RouteNavigationFunction, useRouteNavigation, useTheme } from 'utils/hooks'

const { WEBVIEW_URL_WHAT_TO_BRING_TO_APPOINTMENTS, WEBVIEW_URL_APPOINTMENTS_CLAIM_EXAM_LEARN_MORE } = getEnv()

const getWebViewLink = (
  type: AppointmentDetailsScreenType,
  navigateTo: RouteNavigationFunction<ParamListBase>,
  t: TFunction,
) => {
  let text = t('appointmentsTab.medicationWording.whatToBringLink')
  let url = WEBVIEW_URL_WHAT_TO_BRING_TO_APPOINTMENTS

  if (type === AppointmentDetailsTypeConstants.ClaimExam) {
    text = t('appointmentsTab.medicationWording.claimExam.webLink')
    url = WEBVIEW_URL_APPOINTMENTS_CLAIM_EXAM_LEARN_MORE
  }

  return (
    <LinkWithAnalytics
      type="custom"
      icon={{ name: 'Launch' }}
      onPress={() => {
        navigateTo('Webview', {
          url,
          displayTitle: t('webview.vagov'),
          loadingMessage: t('loading.vaWebsite'),
          useSSO: true,
        })
      }}
      text={text}
    />
  )
}

type AppointmentMedicationWordingProps = {
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

function AppointmentMedicationWording({ subType, type }: AppointmentMedicationWordingProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const body = t('appointmentsTab.medicationWording.default.body')
  const theme = useTheme()

  const webViewLink = getWebViewLink(type, navigateTo, t)

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
      case AppointmentDetailsTypeConstants.ClaimExam:
        return (
          <>
            <VABulletList
              listOfText={[
                { text: t('appointmentsTab.medicationWording.claimExam.bullet1') },
                {
                  text: t('appointmentsTab.medicationWording.claimExam.bullet2'),
                  a11yLabel: a11yLabelVA(t('appointmentsTab.medicationWording.claimExam.bullet2')),
                },
              ]}
            />
            {webViewLink}
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

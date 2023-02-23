import { useTranslation } from 'react-i18next'
import React, { useEffect, useRef, useState } from 'react'

import { Box, ButtonTypesConstants, CollapsibleAlert, CollapsibleAlertProps, TextView, VAButton } from 'components'
import { DemoState } from 'store/slices/demoSlice'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { featureEnabled } from 'utils/remoteConfig'
import { getEncourageUpdateLocalVersion, getWhatsNewVersionSkipped, setWhatsNewVersionSkipped } from 'utils/encourageUpdate'
import { logAnalyticsEvent } from 'utils/analytics'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks'

export const WhatsNew = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const componentMounted = useRef(true)
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const [localVersion, setVersionName] = useState<string>()
  const [skippedVersion, setSkippedVersionHomeScreen] = useState<string>()

  useEffect(() => {
    async function checkLocalVersion() {
      const version = await getEncourageUpdateLocalVersion(demoMode)
      if (componentMounted.current) {
        setVersionName(version)
      }
    }

    async function checkSkippedVersion() {
      const version = await getWhatsNewVersionSkipped()
      if (componentMounted.current) {
        setSkippedVersionHomeScreen(version)
      }
    }

    checkSkippedVersion()
    checkLocalVersion()
    return () => {
      componentMounted.current = false
    }
  }, [demoMode])

  const openCollapse = (): void => {
    logAnalyticsEvent(Events.vama_whatsnew_more())
  }

  const closeCollapse = (): void => {
    logAnalyticsEvent(Events.vama_whatsnew_close())
  }

  const whatsNewAppeared = (): void => {
    logAnalyticsEvent(Events.vama_whatsnew_alert())
  }

  const onPress = (): void => {
    logAnalyticsEvent(Events.vama_whatsnew_dont_show())
    setWhatsNewVersionSkipped(localVersion ? localVersion : '')
    setSkippedVersionHomeScreen(localVersion ? localVersion : '')
  }

  const props: CollapsibleAlertProps = {
    border: 'informational',
    headerText: t('whatsNew.title'),
    body: (
      <>
        <TextView mb={theme.dimensions.standardMarginBetween} accessibilityLabel={t('whatsNew.bodyCopy.a11yLabel')}>
          {t('whatsNew.bodyCopy')}
        </TextView>
        <VAButton onPress={onPress} label={t('whatsNew.dontShowAgain')} buttonType={ButtonTypesConstants.buttonSecondary} />
      </>
    ),
    a11yLabel: t('whatsNew.title'),
    openAnalyticsEvent: openCollapse,
    closeAnalyticsEvent: closeCollapse,
  }

  if (featureEnabled('whatsNewUI') && localVersion !== skippedVersion) {
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <CollapsibleAlert {...props} />
        {whatsNewAppeared()}
      </Box>
    )
  } else {
    return null
  }
}

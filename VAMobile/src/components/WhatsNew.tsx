import { useTranslation } from 'react-i18next'
import React, { useEffect, useRef, useState } from 'react'

import { Box, ButtonTypesConstants, CollapsibleAlert, CollapsibleAlertProps, TextView, VABulletList, VABulletListText, VAButton } from 'components'
import { DemoState } from 'store/slices/demoSlice'
import { Events } from 'constants/analytics'
import { FeatureConstants, getLocalVersion, getVersionSkipped, setVersionSkipped } from 'utils/homeScreenAlerts'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { featureEnabled } from 'utils/remoteConfig'
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

  const BODY_PREFIX = `whatsNew.bodyCopy.${localVersion}`

  useEffect(() => {
    async function checkLocalVersion() {
      const version = await getLocalVersion(FeatureConstants.WHATSNEW, demoMode)
      if (componentMounted.current) {
        setVersionName(version)
      }
    }

    async function checkSkippedVersion() {
      const version = await getVersionSkipped(FeatureConstants.WHATSNEW)
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

  const expandCollapsible = (): void => {
    logAnalyticsEvent(Events.vama_whatsnew_more())
  }

  const closeCollapsible = (): void => {
    logAnalyticsEvent(Events.vama_whatsnew_close())
  }

  const whatsNewAppeared = (): void => {
    logAnalyticsEvent(Events.vama_whatsnew_alert())
  }

  const onPress = (): void => {
    logAnalyticsEvent(Events.vama_whatsnew_dont_show())
    setVersionSkipped(FeatureConstants.WHATSNEW, localVersion || '0.0')
    setSkippedVersionHomeScreen(localVersion || '0.0')
  }

  //@ts-ignore
  const labelValue = t(`${BODY_PREFIX}.a11yLabel`)
  const bodyA11yLabel = labelValue.startsWith(BODY_PREFIX) ? undefined : labelValue

  //@ts-ignore
  const body = t(BODY_PREFIX)

  const getBullets = () => {
    const bullets: VABulletListText[] = []

    while (1) {
      const bulletKey = `${BODY_PREFIX}.bullet.${bullets.length + 1}`
      //@ts-ignore
      const text = t(bulletKey)
      //@ts-ignore
      const a11yLabel = t(`${bulletKey}.a11yLabel`)

      if (text.startsWith(BODY_PREFIX) || !text || bullets.length > 20) {
        return bullets
      } else {
        bullets.push({
          text,
          a11yLabel: a11yLabel.startsWith(BODY_PREFIX) ? undefined : a11yLabel,
        })
      }
    }
  }

  const bullets = getBullets() || []

  const props: CollapsibleAlertProps = {
    border: 'informational',
    headerText: t('whatsNew.title'),
    body: (
      <>
        <Box my={theme.dimensions.standardMarginBetween}>
          <TextView accessibilityLabel={bodyA11yLabel}>{body}</TextView>
          {bullets.length ? (
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VABulletList listOfText={bullets} />
            </Box>
          ) : undefined}
        </Box>
        <VAButton onPress={onPress} label={t('whatsNew.dismissMessage')} buttonType={ButtonTypesConstants.buttonSecondary} />
      </>
    ),
    a11yLabel: t('whatsNew.title'),
    onExpand: expandCollapsible,
    onCollapse: closeCollapsible,
  }

  if (featureEnabled('whatsNewUI') && localVersion !== skippedVersion && body !== BODY_PREFIX) {
    whatsNewAppeared()
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <CollapsibleAlert {...props} />
      </Box>
    )
  } else {
    return null
  }
}

export default WhatsNew

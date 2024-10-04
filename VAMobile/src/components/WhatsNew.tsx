import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { AlertWithHaptics, Box, VABulletList, VABulletListText } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { DemoState } from 'store/slices/demoSlice'
import { logAnalyticsEvent } from 'utils/analytics'
import { FeatureConstants, getLocalVersion, getVersionSkipped, setVersionSkipped } from 'utils/homeScreenAlerts'
import { useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

export const WhatsNew = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const componentMounted = useRef(true)
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const [localVersion, setVersionName] = useState<string>()
  const [skippedVersion, setSkippedVersionHomeScreen] = useState<string>()

  const BODY_PREFIX = `whatsNew.bodyCopy.${localVersion}`
  //@ts-ignore
  const labelValue = t(`${BODY_PREFIX}.a11yLabel`)
  const bodyA11yLabel = labelValue.startsWith(BODY_PREFIX) ? undefined : labelValue

  //@ts-ignore
  const body = t(BODY_PREFIX)

  const displayWN = featureEnabled('whatsNewUI') && localVersion !== skippedVersion && body !== BODY_PREFIX

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

  useEffect(() => {
    if (displayWN) {
      logAnalyticsEvent(Events.vama_whatsnew_alert())
    }
  }, [displayWN])

  const expandCollapsible = () => logAnalyticsEvent(Events.vama_whatsnew_more())
  const closeCollapsible = () => logAnalyticsEvent(Events.vama_whatsnew_close())

  const onPress = () => {
    logAnalyticsEvent(Events.vama_whatsnew_dont_show())
    setVersionSkipped(FeatureConstants.WHATSNEW, localVersion || '0.0')
    setSkippedVersionHomeScreen(localVersion || '0.0')
  }

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

  if (displayWN) {
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <AlertWithHaptics
          variant="info"
          expandable={true}
          header={t('whatsNew.title')}
          description={body}
          descriptionA11yLabel={bodyA11yLabel}
          secondaryButton={{ label: t('whatsNew.dismissMessage'), onPress }}
          analytics={{ onExpand: expandCollapsible, onCollapse: closeCollapsible }}>
          {bullets.length ? <VABulletList listOfText={bullets} paragraphSpacing={true} /> : undefined}
        </AlertWithHaptics>
      </Box>
    )
  } else {
    return null
  }
}

export default WhatsNew

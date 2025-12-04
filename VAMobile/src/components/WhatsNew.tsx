import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { AlertWithHaptics, Box, TextView, VABulletList, VABulletListText } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { WhatsNewConfig } from 'constants/whatsNew'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  FeatureConstants,
  getFeaturesSkipped,
  getLocalVersion,
  getVersionSkipped,
  setFeaturesSkipped,
  setVersionSkipped,
} from 'utils/homeScreenAlerts'
import { useTheme } from 'utils/hooks'
import { FeatureToggleType, featureEnabled } from 'utils/remoteConfig'

export type WhatsNewConfigItem = {
  // Name of the feature being described
  featureName: string
  // If controlled by a feature flag, will not show to the user unless they have the flag enabled
  featureFlag?: FeatureToggleType
}

// Allows for mocking for tests
export const getWhatsNewConfig = () => {
  return WhatsNewConfig
}

export const WhatsNew = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const whatsNewItems = getWhatsNewConfig()

  const [skippedFeatures, setSkippedFeatures] = useState<string[]>() //await getFeaturesSkipped()

  useEffect(() => {
    const retrieveSkippedFeatures = async () => {
      const storedSkippedFeatures = await getFeaturesSkipped()
      setSkippedFeatures(storedSkippedFeatures)
    }

    retrieveSkippedFeatures()
  }, [])

  // TODO: refactor this to not use a while loop
  const getBullets = (featureStringBase: string) => {
    const bullets: VABulletListText[] = []

    while (1) {
      const bulletKey = `${featureStringBase}.bullet.${bullets.length + 1}`
      //@ts-ignore
      const text = t(bulletKey)
      console.log('text: ' + text)
      //@ts-ignore
      const a11yLabel = t(`${bulletKey}.a11yLabel`)

      if (text.startsWith(featureStringBase) || !text || bullets.length > 20) {
        console.log('!!!!! returning bullets')
        return bullets
      } else {
        bullets.push({
          text,
          a11yLabel: a11yLabel.startsWith(featureStringBase) ? undefined : a11yLabel,
        })
      }
    }
  }

  const whatsNewDisplay: React.ReactNode[] = []
  const featuresDisplayed: string[] = []

  if (whatsNewItems.length) {
    ;(whatsNewItems as WhatsNewConfigItem[]).forEach((newFeature) => {
      // Do not show features that do not have their flag enabled
      const shouldDisplayFeature = !newFeature.featureFlag || featureEnabled(newFeature.featureFlag)
      // Check if the feature has already been skipped by dismissing a whats new including it
      const featureSkipped = skippedFeatures?.includes(newFeature.featureName)

      if (!shouldDisplayFeature || featureSkipped) {
        return
      } else {
        featuresDisplayed.push(newFeature.featureName)
      }

      // The base string of the feature will be the key for the main description text.
      const featureStringBase = `whatsNew.bodyCopy.${newFeature.featureName}`
      // Attempt to translate the base string
      //@ts-ignore
      const labelValue = t(`${featureStringBase}.a11yLabel`)
      /**
       * If there is no translation string found, translation will return the key used. Match this to know if there
       * is an a11y label for this string, if not we will skip it
       */
      const bodyA11yLabel = labelValue.startsWith(featureStringBase) ? undefined : labelValue

      //@ts-ignore
      const body = t(featureStringBase)
      const bullets = getBullets(featureStringBase) || []

      whatsNewDisplay.push(
        <>
          {/* eslint-disable-next-line react-native-a11y/has-accessibility-hint */}
          <TextView accessibilityLabel={bodyA11yLabel} pb={theme.dimensions.standardMarginBetween}>
            {body}
          </TextView>
          {bullets.length ? <VABulletList listOfText={bullets} paragraphSpacing={true} /> : undefined}
        </>,
      )
    })
  }

  const expandCollapsible = () => logAnalyticsEvent(Events.vama_whatsnew_more())
  const closeCollapsible = () => logAnalyticsEvent(Events.vama_whatsnew_close())

  const onDismiss = () => {
    logAnalyticsEvent(Events.vama_whatsnew_dont_show())
    setFeaturesSkipped(featuresDisplayed)
  }

  const displayWN = !!whatsNewDisplay.length

  useEffect(() => {
    if (displayWN) {
      logAnalyticsEvent(Events.vama_whatsnew_alert())
    }
  }, [displayWN])

  if (displayWN) {
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <AlertWithHaptics
          variant="info"
          expandable={true}
          header={t('whatsNew.title')}
          secondaryButton={{ label: t('whatsNew.dismissMessage'), onPress: onDismiss }}
          analytics={{ onExpand: expandCollapsible, onCollapse: closeCollapsible }}>
          {whatsNewDisplay}
        </AlertWithHaptics>
      </Box>
    )
  } else {
    return null
  }
}

export default WhatsNew

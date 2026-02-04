import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AlertWithHaptics, Box, LinkWithAnalytics, TextView, VABulletList, VABulletListText } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { getWhatsNewConfig } from 'constants/whatsNew'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { getFeaturesSkipped, setFeaturesSkipped } from 'utils/whatsNew'

export const WhatsNew = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const whatsNewItems = getWhatsNewConfig()
  const { data: authorizedServices } = useAuthorizedServices()

  const [skippedFeatures, setSkippedFeatures] = useState<string[]>() //await getFeaturesSkipped()

  useEffect(() => {
    const retrieveSkippedFeatures = async () => {
      const storedSkippedFeatures = await getFeaturesSkipped()
      setSkippedFeatures(storedSkippedFeatures)
    }

    retrieveSkippedFeatures()
  }, [])

  const { whatsNewDisplay, featuresDisplayed } = useMemo(() => {
    const display: React.ReactNode[] = []
    const features: string[] = []
    let firstItemAdded = true

    if (whatsNewItems.length) {
      whatsNewItems.forEach((newFeature, idx) => {
        // Do not show features that do not have their flag enabled
        const featureIsEnabled = !newFeature.featureFlag || featureEnabled(newFeature.featureFlag)
        // Do not show if user is not authorized
        const featureIsAuthorized =
          !newFeature.authorizedService || (authorizedServices && authorizedServices[newFeature.authorizedService])
        // Check if the feature has already been skipped by dismissing a whats new including it
        const featureSkipped = skippedFeatures?.includes(newFeature.featureName)

        if (!featureIsEnabled || !featureIsAuthorized || featureSkipped) {
          return
        } else {
          features.push(newFeature.featureName)
        }

        // The base string of the feature will be the key for the main description text.
        const featureStringBase = `whatsNew.bodyCopy.${newFeature.featureName}`
        // Attempt to translate the base string
        const labelValue = t(`${featureStringBase}.a11yLabel`)
        /**
         * If there is no translation string found, translation will return the key used. Match this to know if there
         * is an a11y label for this string, if not we will skip it
         */
        const bodyA11yLabel = labelValue.startsWith(featureStringBase) ? undefined : labelValue

        const body = t(featureStringBase)
        const bullets: VABulletListText[] = []

        if (newFeature.bullets) {
          for (let i = 1; i <= newFeature.bullets; i++) {
            const bulletKey = `${featureStringBase}.bullet.${i}`
            const text = t(bulletKey)
            const a11yLabel = t(`${bulletKey}.a11yLabel`)

            bullets.push({
              text,
              a11yLabel: a11yLabel.startsWith(featureStringBase) ? undefined : a11yLabel,
            })
          }
        }

        // Check if we have a link to show
        const showLink = newFeature.hasLink

        const getLink = () => {
          if (showLink) {
            const linkKey = `${featureStringBase}.link.url`
            const linkUrl = t(linkKey)
            const linkTextKey = `${featureStringBase}.link.text`
            const linkText = t(linkTextKey)

            return (
              <LinkWithAnalytics
                type="url"
                url={linkUrl}
                text={linkText}
                a11yHint={`${linkText} ${t('mobileBodyLink.a11yHint')}`}
              />
            )
          } else {
            return null
          }
        }

        const topPadding = firstItemAdded ? 0 : theme.dimensions.standardMarginBetween
        firstItemAdded = false

        display.push(
          <Box key={idx} pt={topPadding}>
            {/* eslint-disable-next-line react-native-a11y/has-accessibility-hint */}
            <TextView accessible={true} accessibilityLabel={bodyA11yLabel} pb={theme.dimensions.tinyMarginBetween}>
              {body}
            </TextView>
            {bullets.length ? <VABulletList listOfText={bullets} /> : undefined}
            {getLink()}
          </Box>,
        )
      })
    }

    return {
      whatsNewDisplay: display,
      featuresDisplayed: features,
    }
  }, [
    skippedFeatures,
    t,
    theme.dimensions.standardMarginBetween,
    theme.dimensions.tinyMarginBetween,
    whatsNewItems,
    authorizedServices,
  ])

  const expandCollapsible = () => logAnalyticsEvent(Events.vama_whatsnew_more())
  const closeCollapsible = () => logAnalyticsEvent(Events.vama_whatsnew_close())

  const onDismiss = async () => {
    logAnalyticsEvent(Events.vama_whatsnew_dont_show(skippedFeatures))
    await setFeaturesSkipped(featuresDisplayed)
    const storedSkippedFeatures = await getFeaturesSkipped()
    setSkippedFeatures(storedSkippedFeatures)
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
          initializeExpanded={true}
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

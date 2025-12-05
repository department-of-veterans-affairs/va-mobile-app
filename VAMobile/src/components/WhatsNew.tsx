import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AlertWithHaptics, Box, LinkWithAnalytics, TextView, VABulletList, VABulletListText } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { getFeaturesSkipped, getWhatsNewConfig, setFeaturesSkipped } from 'utils/whatsNew'

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

  // TODO: refactor this to not use a while loop
  const getBullets = useCallback(
    (featureStringBase: string) => {
      const bullets: VABulletListText[] = []

      while (1) {
        const bulletKey = `${featureStringBase}.bullet.${bullets.length + 1}`
        //@ts-ignore
        const text = t(bulletKey)
        //@ts-ignore
        const a11yLabel = t(`${bulletKey}.a11yLabel`)

        if (text.startsWith(featureStringBase) || !text || bullets.length > 20) {
          return bullets
        } else {
          bullets.push({
            text,
            a11yLabel: a11yLabel.startsWith(featureStringBase) ? undefined : a11yLabel,
          })
        }
      }
    },
    [t],
  )

  const { whatsNewDisplay, featuresDisplayed } = useMemo(() => {
    const display: React.ReactNode[] = []
    const features: string[] = []

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

        // get URL if it exists
        const linkKey = `${featureStringBase}.link.url`
        const linkUrl = t(linkKey)
        const linkTextKey = `${featureStringBase}.link.text`
        const linkText = t(linkTextKey)
        // Check if we have a link to show
        const showLink = !linkUrl.startsWith(featureStringBase)

        const topPadding = idx === 0 ? 0 : theme.dimensions.standardMarginBetween

        display.push(
          <Box key={idx} pt={topPadding}>
            {/* eslint-disable-next-line react-native-a11y/has-accessibility-hint */}
            <TextView accessibilityLabel={bodyA11yLabel} pb={theme.dimensions.tinyMarginBetween}>
              {body}
            </TextView>
            {bullets.length ? <VABulletList listOfText={bullets} /> : undefined}
            {showLink ? (
              <LinkWithAnalytics
                type="url"
                url={linkUrl}
                text={linkText}
                a11yHint={`${linkText} ${t('mobileBodyLink.a11yHint')}`}
              />
            ) : undefined}
          </Box>,
        )
      })
    }

    return {
      whatsNewDisplay: display,
      featuresDisplayed: features,
    }
  }, [
    getBullets,
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
    logAnalyticsEvent(Events.vama_whatsnew_dont_show())
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

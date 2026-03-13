import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigation } from '@react-navigation/native'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { CardDataValue } from 'components/CarouselCards/Card'
import { VABulletListText } from 'components/VABulletList'
import { TextView, VABulletList } from 'components/index'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { getWhatsNewConfig } from 'constants/whatsNew'
import { logAnalyticsEvent } from 'utils/analytics'
import { featureEnabled } from 'utils/remoteConfig'
import { getFeaturesSkipped, setFeaturesSkipped } from 'utils/whatsNew'

export const useWhatsNewToDisplay = () => {
  const navigation = useNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { data: authorizedServices } = useAuthorizedServices()
  const [skippedFeatures, setSkippedFeatures] = useState<string[]>() //await getFeaturesSkipped()

  // Retrieves the skipped features from async storage
  useEffect(() => {
    const retrieveSkippedFeatures = async () => {
      const storedSkippedFeatures = await getFeaturesSkipped()
      setSkippedFeatures(storedSkippedFeatures)
    }

    retrieveSkippedFeatures()
  }, [])

  const whatsNewItems = getWhatsNewConfig()

  return useMemo(() => {
    const display: CardDataValue[] = []

    if (whatsNewItems.length) {
      whatsNewItems.forEach((newFeature) => {
        // Do not show features that do not have their flag enabled
        const featureIsEnabled = !newFeature.featureFlag || featureEnabled(newFeature.featureFlag)
        // Do not show if user is not authorized
        const featureIsAuthorized =
          !newFeature.authorizedService || (authorizedServices && authorizedServices[newFeature.authorizedService])
        // Check if the feature has already been skipped by dismissing a whats new including it
        const featureSkipped = skippedFeatures?.includes(newFeature.featureName)

        if (!featureIsEnabled || !featureIsAuthorized || featureSkipped) {
          return
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
              variant: 'HelperText',
              a11yLabel: a11yLabel.startsWith(featureStringBase) ? undefined : a11yLabel,
            })
          }
        }

        const onAction = () => {
          if (newFeature.tab) {
            // @ts-ignore todo figure out why
            navigation.navigate(newFeature.tab, {
              screen: newFeature.route,
            })
          } else {
            // @ts-ignore todo figure out why
            navigation.navigate(newFeature.route)
          }
        }

        display.push({
          id: newFeature.featureName,
          title: t(`whatsNew.title.${newFeature.featureName}`),
          onDismiss: async () => {
            logAnalyticsEvent(Events.vama_whatsnew_dont_show(skippedFeatures))
            await setFeaturesSkipped([newFeature.featureName])
            const storedSkippedFeatures = await getFeaturesSkipped()
            setSkippedFeatures(storedSkippedFeatures)
          },
          onAction: newFeature.route || newFeature.tab ? onAction : undefined,
          content: (
            <>
              {/* eslint-disable-next-line react-native-a11y/has-accessibility-hint */}
              <TextView variant="vadsFontBodySmall" accessible accessibilityLabel={bodyA11yLabel}>
                {body}
              </TextView>
              {bullets.length ? <VABulletList listOfText={bullets} /> : undefined}
            </>
          ),
        })
      })
    }

    return display
  }, [whatsNewItems, authorizedServices, skippedFeatures, t, navigation])
}

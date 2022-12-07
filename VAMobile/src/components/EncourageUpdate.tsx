import { useTranslation } from 'react-i18next'
import React, { useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ButtonTypesConstants, VAButton } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { featureEnabled } from 'utils/remoteConfig'
import { getEncourageUpdateLocalVersion, getStoreVersion, getVersionSkipped, openAppStore, setVersionSkipped } from 'utils/encourageUpdate'
import { isIOS } from 'utils/platform'
import { logAnalyticsEvent } from 'utils/analytics'
import { requestStorePopup } from 'utils/rnInAppUpdate'
import { useTheme } from 'utils/hooks'

export const EncourageUpdateAlert = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HOME)
  const [localVersionName, setVersionName] = useState<string>()
  const [skippedVersion, setSkippedVersionHomeScreen] = useState<string>()
  const [storeVersion, setStoreVersionScreen] = useState<string>()
  const componentMounted = useRef(true)

  useEffect(() => {
    async function checkLocalVersion() {
      const version = await getEncourageUpdateLocalVersion()
      if (componentMounted.current) {
        setVersionName(version)
      }
    }

    async function checkSkippedVersion() {
      const version = await getVersionSkipped()
      if (componentMounted.current) {
        setSkippedVersionHomeScreen(version)
      }
    }

    async function checkStoreVersion() {
      const result = await getStoreVersion()
      if (componentMounted.current) {
        setStoreVersionScreen(result)
      }
    }
    checkStoreVersion()
    checkSkippedVersion()
    checkLocalVersion()
    return () => {
      componentMounted.current = false
    }
  }, [])

  const callRequestStorePopup = async () => {
    const result = await requestStorePopup()
    if (result && isIOS()) {
      logAnalyticsEvent(Events.vama_eu_updated_success())
      openAppStore()
    } else if (result) {
      logAnalyticsEvent(Events.vama_eu_updated_success())
      setVersionName(storeVersion ? storeVersion : '0.0.0')
    }
  }

  const onUpdatePressed = (): void => {
    logAnalyticsEvent(Events.vama_eu_updated())
    callRequestStorePopup()
  }

  const onSkipPressed = (): void => {
    logAnalyticsEvent(Events.vama_eu_skipped())
    setVersionSkipped(storeVersion ? storeVersion : '0.0.0.')
    setSkippedVersionHomeScreen(storeVersion ? storeVersion : '0.0.0.')
  }

  if (featureEnabled('inAppUpdates') && skippedVersion !== storeVersion && localVersionName !== storeVersion && storeVersion && localVersionName && skippedVersion) {
    logAnalyticsEvent(Events.vama_eu_shown())
    return (
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.buttonPadding}>
        <AlertBox title={t('encourageUpdate.title')} text={t('encourageUpdate.body')} border="informational">
          <Box>
            <Box my={theme.dimensions.gutter} accessibilityRole="button" mr={theme.dimensions.buttonPadding}>
              <VAButton onPress={onUpdatePressed} label={t('encourageUpdate.update')} buttonType={ButtonTypesConstants.buttonPrimary} />
            </Box>
            <Box mr={theme.dimensions.buttonPadding} accessibilityRole="button">
              <VAButton onPress={onSkipPressed} label={t('encourageUpdate.skip')} buttonType={ButtonTypesConstants.buttonSecondary} />
            </Box>
          </Box>
        </AlertBox>
      </Box>
    )
  } else {
    return null
  }
}

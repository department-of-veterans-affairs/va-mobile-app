import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { AlertWithHaptics, Box, WhatsNew } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { DemoState } from 'store/slices/demoSlice'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  FeatureConstants,
  getLocalVersion,
  getStoreVersion,
  getVersionSkipped,
  setVersionSkipped,
} from 'utils/homeScreenAlerts'
import { useOpenAppStore, useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'
import { featureEnabled } from 'utils/remoteConfig'

export const EncourageUpdateAlert = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const [localVersionName, setVersionName] = useState<string>()
  const [skippedVersion, setSkippedVersionHomeScreen] = useState<string>()
  const [storeVersion, setStoreVersionScreen] = useState<string>()
  const componentMounted = useRef(true)
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const openAppStore = useOpenAppStore()

  const displayEU =
    featureEnabled('inAppUpdates') &&
    storeVersion &&
    localVersionName &&
    skippedVersion &&
    skippedVersion !== storeVersion &&
    ((isIOS() && storeVersion > localVersionName) || (!isIOS() && +storeVersion > +localVersionName))

  useEffect(() => {
    async function checkLocalVersion() {
      const version = await getLocalVersion(FeatureConstants.ENCOURAGEUPDATE, demoMode)
      if (componentMounted.current) {
        setVersionName(version)
      }
    }

    async function checkSkippedVersion() {
      const version = await getVersionSkipped(FeatureConstants.ENCOURAGEUPDATE)
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
  }, [demoMode])

  useEffect(() => {
    if (displayEU) {
      logAnalyticsEvent(Events.vama_eu_shown())
    }
  }, [displayEU])

  const onUpdatePressed = (): void => {
    logAnalyticsEvent(Events.vama_eu_updated())
    openAppStore()
  }

  const onSkipPressed = (): void => {
    logAnalyticsEvent(Events.vama_eu_skipped())
    setVersionSkipped(FeatureConstants.ENCOURAGEUPDATE, storeVersion ? storeVersion : '0.0')
    setSkippedVersionHomeScreen(storeVersion ? storeVersion : '0.0')
  }

  if (displayEU) {
    return (
      <Box mb={theme.dimensions.buttonPadding}>
        <AlertWithHaptics
          variant="warning"
          header={t('encourageUpdate.title')}
          description={t('encourageUpdate.body')}
          primaryButton={{ label: t('updateNow'), onPress: onUpdatePressed }}
          secondaryButton={{ label: t('encourageUpdate.skip'), onPress: onSkipPressed }}
        />
      </Box>
    )
  } else if (localVersionName && storeVersion && localVersionName >= storeVersion) {
    return <WhatsNew />
  } else {
    return null
  }
}

export default EncourageUpdateAlert

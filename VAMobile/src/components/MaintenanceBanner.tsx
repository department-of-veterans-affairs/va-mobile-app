import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useMaintenanceWindows } from 'api/maintenanceWindows/getMaintenanceWindows'
import { AlertWithHaptics, Box, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDToDowntimeFeatures, ScreenIDTypes } from 'store/api'
import { logAnalyticsEvent } from 'utils/analytics'
import { getFeaturesInDowntime, getFeaturesInDowntimeWindow, latestDowntimeWindow, useTheme } from 'utils/hooks'

export type MaintenanceBannerProps = {
  screenID?: ScreenIDTypes
}

const MaintenanceBanner: FC<MaintenanceBannerProps> = (props) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { maintenanceWindows } = useMaintenanceWindows()
  const [logDowntimeAnalytics, setLogDowntimeAnalytics] = useState(true)
  const features = props.screenID ? ScreenIDToDowntimeFeatures[props.screenID] : []

  // If we have no screen to match downtime features on, display nothing
  if (!props.screenID) {
    return null
  }

  const featuresInDowntime = getFeaturesInDowntime(features, maintenanceWindows)
  const isInDowntime = !!featuresInDowntime.length
  const featuresInDowntimeWindow = getFeaturesInDowntimeWindow(features, maintenanceWindows)
  const isInDowntimeWindow = !!featuresInDowntimeWindow.length

  if (!isInDowntime && !isInDowntimeWindow) {
    return null
  }

  // Trigger analytics
  if (logDowntimeAnalytics) {
    features.forEach((feature) => {
      const downtimeWindow = maintenanceWindows[feature]
      if (downtimeWindow)
        logAnalyticsEvent(Events.vama_mw_shown(feature, downtimeWindow.startTime, downtimeWindow?.endTime))
    })
    setLogDowntimeAnalytics(false)
  }

  const getDowntimeMessage = () => {
    if (isInDowntime) {
      const window = latestDowntimeWindow(featuresInDowntime, maintenanceWindows)
      return t('maintenanceBanner.info', { time: window?.endTime.toLocal().toFormat('HH:mm ZZZZ') })
    } else {
      const window = latestDowntimeWindow(featuresInDowntimeWindow, maintenanceWindows)

      return t('maintenanceBanner.info.window', {
        date: window?.startTime.toLocal().toFormat('MMMM d'),
        start: window?.startTime.toLocal().toFormat('HH:mm'),
        end: window?.endTime.toLocal().toFormat('HH:mm ZZZZ'),
      })
    }
  }

  return (
    <Box mb={theme.dimensions.condensedMarginBetween}>
      <AlertWithHaptics
        variant="info"
        header={isInDowntime ? t('maintenanceBanner.header') : t('maintenanceBanner.header.upcoming')}
        expandable={true}
        initializeExpanded={false}>
        <TextView>{getDowntimeMessage()}</TextView>
      </AlertWithHaptics>
    </Box>
  )
}

export default MaintenanceBanner

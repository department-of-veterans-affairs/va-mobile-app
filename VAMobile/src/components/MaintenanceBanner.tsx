import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { AlertWithHaptics, Box, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDToDowntimeFeatures, ScreenIDTypes } from 'store/api'
import { ErrorsState } from 'store/slices'
import { logAnalyticsEvent } from 'utils/analytics'
import { oneOfFeaturesInDowntime, useTheme } from 'utils/hooks'

export type MaintenanceBannerProps = {
  screenID?: ScreenIDTypes
}

const MaintenanceBanner: FC<MaintenanceBannerProps> = (props) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { downtimeWindowsByFeature } = useSelector<RootState, ErrorsState>((state) => state.errors)
  const [logDowntimeAnalytics, setLogDowntimeAnalytics] = useState(true)

  if (!props.screenID) {
    return null
  }

  const features = ScreenIDToDowntimeFeatures[props.screenID]
  const isInDowntime = oneOfFeaturesInDowntime(features, downtimeWindowsByFeature)

  if (!isInDowntime) {
    return null
  }

  if (isInDowntime) {
    if (logDowntimeAnalytics) {
      features.forEach((feature) => {
        const downtimeWindow = downtimeWindowsByFeature[feature]
        if (downtimeWindow)
          logAnalyticsEvent(Events.vama_mw_shown(feature, downtimeWindow.startTime, downtimeWindow?.endTime))
      })
      setLogDowntimeAnalytics(false)
    }
  }

  return (
    <Box mb={theme.dimensions.condensedMarginBetween}>
      <AlertWithHaptics
        variant="info"
        header={t('maintenanceBanner.header')}
        expandable={true}
        initializeExpanded={false}>
        <TextView>{t('maintenanceBanner.info')}</TextView>
      </AlertWithHaptics>
    </Box>
  )
}

export default MaintenanceBanner

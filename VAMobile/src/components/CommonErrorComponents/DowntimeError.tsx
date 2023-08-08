import { ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, VAScrollView } from 'components'
import { DowntimeWindow, ErrorsState } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { DowntimeFeatureType, ScreenIDToDowntimeFeature, ScreenIDTypes, ScreenIDToFeatureName } from 'store/api/types'
import { useSelector } from 'react-redux'
import { useDowntime, useTheme } from 'utils/hooks'

export type DowntimeErrorProps = {
  /**The screen id for the screen that has the errors*/
  screenID: ScreenIDTypes
}

/**Common component to show an alert when the service is down*/
const DowntimeError: FC<DowntimeErrorProps> = ({ screenID }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    justifyContent: 'center',
  }

  const containerStyles = {
    mt: theme.dimensions.contentMarginTop,
    mb: theme.dimensions.contentMarginBottom,
  }
  const { downtimeWindowsByFeature } = useSelector<RootState, ErrorsState>((state) => state.errors)
  const features = ScreenIDToDowntimeFeature[screenID]
  let latestDowntimeWindow: DowntimeWindow | null = null
  features.forEach(feature => {
    if (useDowntime(feature as DowntimeFeatureType)) {
      const downtimeWindow = downtimeWindowsByFeature[feature as DowntimeFeatureType]
      if (downtimeWindow) {
        if (latestDowntimeWindow === null) {
          latestDowntimeWindow = downtimeWindow
        } else if (latestDowntimeWindow.endTime < downtimeWindow.endTime) {
          latestDowntimeWindow = downtimeWindow
        }
      }
    }
  })

  const featureName = ScreenIDToFeatureName[screenID]
  const endTime = !!latestDowntimeWindow ? (latestDowntimeWindow as DowntimeWindow).endTime.toFormat('fff') : ''

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox
          title={t('downtime.title')}
          titleA11yLabel={t('downtime.title')}
          text={t('downtime.message', { featureName, endTime })}
          textA11yLabel={t('downtime.message', { featureName, endTime })}
          border="warning"
        />
      </Box>
    </VAScrollView>
  )
}

export default DowntimeError

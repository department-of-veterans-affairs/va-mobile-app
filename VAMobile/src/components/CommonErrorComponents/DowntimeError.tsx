import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import { AlertWithHaptics, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { DowntimeFeatureType, ScreenIDToDowntimeFeatures, ScreenIDTypes } from 'store/api/types'
import { DowntimeWindow, ErrorsState } from 'store/slices'
import { a11yLabelID } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { featureInDowntime, useTheme } from 'utils/hooks'

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
  const features = ScreenIDToDowntimeFeatures[screenID]
  // if there are multiple active downtime windows for the screen, use the latest endTime
  let latestDowntimeWindow: DowntimeWindow | null = null
  features.forEach((feature) => {
    if (featureInDowntime(feature as DowntimeFeatureType, downtimeWindowsByFeature)) {
      const downtimeWindow = downtimeWindowsByFeature[feature as DowntimeFeatureType]
      if (downtimeWindow && (latestDowntimeWindow === null || latestDowntimeWindow.endTime < downtimeWindow.endTime)) {
        latestDowntimeWindow = downtimeWindow
      }
    }
  })

  const endTime = latestDowntimeWindow
    ? (latestDowntimeWindow as DowntimeWindow).endTime.toFormat("DDD 'at' t ZZZZ")
    : ''

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertWithHaptics
          variant="warning"
          header={t('downtime.title')}
          description={t('downtime.message.1', { endTime })}
          descriptionA11yLabel={t('downtime.message.1.a11yLabel', { endTime })}>
          <TextView accessibilityLabel={t('downtime.message.2.a11yLabel')} my={theme.dimensions.contentMarginTop}>
            {t('downtime.message.2')}
          </TextView>
          <ClickToCallPhoneNumber
            displayedText={displayedTextPhoneNumber(t('8006982411'))}
            phone={t('8006982411')}
            a11yLabel={a11yLabelID(t('8006982411'))}
          />
        </AlertWithHaptics>
      </Box>
    </VAScrollView>
  )
}

export default DowntimeError

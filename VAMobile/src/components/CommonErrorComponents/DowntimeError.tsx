import { ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, VAScrollView } from 'components'
import { DowntimeScreenIDToFeature, useTheme } from 'utils/hooks'
import { ErrorsState } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypes } from 'store/api/types'
import { useSelector } from 'react-redux'

export type DowntimeErrorProps = {
  /**The screen id for the screen that has the errors*/
  screenID: ScreenIDTypes
  /**Override the feature name in the event that a feature happens to share the same api error(ex:contact information and personal information) */
  overrideFeatureName?: string
}

/**Common component to show an alert when the service is down*/
const DowntimeError: FC<DowntimeErrorProps> = ({ screenID, overrideFeatureName }) => {
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
  const feature = DowntimeScreenIDToFeature(screenID)
  const downtimeWindow = feature ? downtimeWindowsByFeature[feature] : null
  let featureName = overrideFeatureName
  if (!featureName) {
    featureName = downtimeWindow?.featureName
  }
  const endTime = downtimeWindow?.endTime.toFormat('fff')

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

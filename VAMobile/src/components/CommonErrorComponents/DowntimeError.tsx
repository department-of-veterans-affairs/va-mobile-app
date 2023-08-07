import { ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, VAScrollView } from 'components'
import { ErrorsState } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDToDowntimeFeature, ScreenIDTypes, ScreenNameFeatureConstants } from 'store/api/types'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks'

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
  const feature = ScreenIDToDowntimeFeature[screenID]
  const downtimeWindow = feature ? downtimeWindowsByFeature[feature] : null

  const featureName = ScreenNameFeatureConstants[screenID]
  // const featureName = t(`downtime.${screenID}.featureName`)
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

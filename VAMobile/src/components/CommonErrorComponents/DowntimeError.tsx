import { ErrorsState, StoreState } from 'store'
import { ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AlertBox, Box, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypes } from 'store/api/types'
import { useTheme, useTranslation } from 'utils/hooks'

export type DowntimeErrorProps = {
  screenID: ScreenIDTypes
}

const DowntimeError: FC<DowntimeErrorProps> = ({ screenID }) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    justifyContent: 'center',
    backgroundColor: theme.colors.background.main,
  }

  const containerStyles = {
    mx: theme.dimensions.gutter,
    mt: theme.dimensions.contentMarginTop,
    mb: theme.dimensions.contentMarginBottom,
  }
  const { errorMetadataByScreenID } = useSelector<StoreState, ErrorsState>((s) => s.errors)
  const featureName = errorMetadataByScreenID[screenID]?.featureName
  const endTime = errorMetadataByScreenID[screenID]?.endTime

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox
          title={t('downtime.title')}
          titleA11yLabel={t('downtime.title')}
          text={t('downtime.message', { featureName, endTime })}
          textA11yLabel={t('downtime.message', { featureName, endTime })}
          border="warning"
          background="noCardBackground"
        />
      </Box>
    </VAScrollView>
  )
}

export default DowntimeError

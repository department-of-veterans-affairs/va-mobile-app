import { ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { AlertBox, Box, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

export type DowntimeErrorProps = {
  /** optional function called when the Try again button is pressed */
  feature?: string
  end?: string
}

const DowntimeError: FC<DowntimeErrorProps> = ({ feature, end }) => {
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

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox
          title={t('downtime.title')}
          titleA11yLabel={t('downtime.title.a11yHint')}
          text={t('downtime.message', { feature, end })}
          textA11yLabel={t('downtime.message.a11yLabel', { feature, end })}
          border="warning"
          background="noCardBackground"
        />
      </Box>
    </VAScrollView>
  )
}

export default DowntimeError

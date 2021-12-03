import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATextColors, VATypographyThemeVariants } from 'styles/theme'
import { buildNumber, versionName } from 'utils/deviceData'
import { useTheme, useTranslation } from 'utils/hooks'

export type AppVersionAndBuildProps = {
  /** color of the text */
  textColor?: keyof VATextColors
  /** font weight of the text */
  textWeight?: keyof VATypographyThemeVariants
}

/**
 * Common component to display the apps version and build number
 */
const AppVersionAndBuild: FC<AppVersionAndBuildProps> = ({ textColor = 'primary', textWeight = 'MobileBody' }) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <Box mb={theme.dimensions.contentMarginBottom} justifyContent={'center'} alignItems={'center'}>
      <TextView variant={textWeight} flexDirection="row" color={textColor}>
        {t('versionAndBuild', { versionName, buildNumber })}
      </TextView>
    </Box>
  )
}

export default AppVersionAndBuild

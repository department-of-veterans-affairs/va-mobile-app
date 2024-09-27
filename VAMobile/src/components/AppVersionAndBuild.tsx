import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppVersion } from 'api/device/getAppVersion'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATextColors, VATypographyThemeVariants } from 'styles/theme'
import { getBuildNumber } from 'utils/deviceData'
import { useTheme } from 'utils/hooks'

export type AppVersionAndBuildProps = {
  /** color of the text */
  textColor?: keyof VATextColors
  /** font weight of the text */
  textWeight?: keyof VATypographyThemeVariants
}

/**
 * Common component to display the apps version and build number
 */
const AppVersionAndBuild: FC<AppVersionAndBuildProps> = ({ textColor = 'bodyText', textWeight = 'MobileBody' }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [buildNumber, setBuildNumber] = useState<number>()
  const appVersionQuery = useAppVersion()

  useEffect(() => {
    async function getVersionAndBuild() {
      const build = await getBuildNumber()
      setBuildNumber(build)
    }

    getVersionAndBuild()
  }, [])

  return (
    <Box mb={theme.dimensions.contentMarginBottom} justifyContent={'center'} alignItems={'center'}>
      <TextView testID="AppVersionTestID" variant={textWeight} flexDirection="row" color={textColor}>
        {t('versionAndBuild', { versionName: appVersionQuery.data, buildNumber })}
      </TextView>
    </Box>
  )
}

export default AppVersionAndBuild

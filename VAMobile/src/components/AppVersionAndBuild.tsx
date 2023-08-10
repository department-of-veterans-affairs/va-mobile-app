import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATextColors, VATypographyThemeVariants } from 'styles/theme'
import { getBuildNumber, getVersionName } from 'utils/deviceData'
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
  const [versionName, setVersionName] = useState<string>()
  const [buildNumber, setBuildNumber] = useState<number>()

  useEffect(() => {
    async function getVersionAndBuild() {
      const version = await getVersionName()
      const build = await getBuildNumber()
      setVersionName(version)
      setBuildNumber(build)
    }

    getVersionAndBuild()
  }, [])

  return (
    <Box mb={theme.dimensions.contentMarginBottom} justifyContent={'center'} alignItems={'center'}>
      <TextView testID="AppVersionTestID" variant={textWeight} flexDirection="row" color={textColor}>
        {t('versionAndBuild', { versionName, buildNumber })}
      </TextView>
    </Box>
  )
}

export default AppVersionAndBuild

import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps } from 'react-native'

import { Box, TextView } from 'components/index'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

/**
 * Crisis Line Button component
 */
const CrisisLineButton: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const pressableProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'link',
    onPress: () => navigateTo('VeteransCrisisLine'),
    style: ({ pressed }) => [
      {
        backgroundColor: pressed
          ? theme.colors.buttonBackground.crisisLineActive
          : theme.colors.buttonBackground.crisisLine,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: theme.dimensions.touchableMinHeight,
        borderRadius: 40,
      },
    ],
  }

  return (
    <Box mx={theme.dimensions.gutter} my={theme.dimensions.standardMarginBetween}>
      <Pressable {...pressableProps}>
        <TextView variant={'CrisisLineButton'} py={14}>
          {t('crisisLineButton.label')}
        </TextView>
      </Pressable>
    </Box>
  )
}

export default CrisisLineButton

import { Box, BoxProps, TextView, VAIcon, VAIconProps } from 'components'
import { Pressable, PressableProps } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { RefillStatus } from 'store/api/types'
import { getTagColorForStatus, getTextForRefillStatus } from 'utils/prescriptions'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export type RefillTagProps = {
  status: RefillStatus
}

const RefillTag: FC<RefillTagProps> = ({ status }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  const statusText = getTextForRefillStatus(status, t)

  const infoIconProps: VAIconProps = {
    name: 'InfoIcon',
    fill: 'statusInfoIcon',
    height: 16,
    width: 16,
    ml: 10,
  }

  const pressableProps: PressableProps = {
    onPress: navigateTo('StatusGlossary', { display: statusText, value: status }),
    accessible: true,
    accessibilityRole: 'button',
    accessibilityHint: t('prescription.history.a11yHint.top'),
  }

  const tagBoxProps: BoxProps = {
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    backgroundColor: getTagColorForStatus(status),
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    height: 42,
    px: theme.dimensions.gutter,
  }

  return (
    <Pressable {...pressableProps}>
      <Box {...tagBoxProps}>
        <TextView variant={'HelperText'} flexWrap={'wrap'} pt={3}>
          {statusText}
        </TextView>
        <VAIcon {...infoIconProps} />
      </Box>
    </Pressable>
  )
}

export default RefillTag

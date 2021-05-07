import { Pressable, PressableProps } from 'react-native'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

export type PaginationProps = {
  /** page number */
  page: number
  /** total number of items */
  totalEntries: number
  /** pageSize */
  pageSize: number
  /** function to be called when previous is selected */
  onPrev: () => void
  /** function to be called when next is selected */
  onNext: () => void
}

type PaginationArrowProps = {
  /** function called when pressed */
  onPress: () => void
  /** optional accessibility hint */
  a11yHint?: string
  /** whether or not this button is disabled */
  disabled: boolean
  /** test id */
  testID: string
  /** props for icon */
  iconProps: VAIconProps
}

export const PaginationArrow: FC<PaginationArrowProps> = ({ onPress, a11yHint, iconProps, testID, disabled }) => {
  const theme = useTheme()

  const pressableProps: PressableProps = {
    onPress: onPress,
    accessibilityRole: 'link',
    disabled,
    accessible: true,
    accessibilityHint: a11yHint,
    accessibilityState: disabled ? { disabled: true } : {},
  }

  const boxProps: BoxProps = {
    backgroundColor: disabled ? 'buttonSecondaryDisabled' : 'buttonPrimary',
    minHeight: theme.dimensions.touchableMinHeight,
    p: theme.dimensions.paginationButtonPadding,
    borderRadius: 5,
  }
  return (
    <Pressable {...pressableProps} {...testIdProps(testID)}>
      <Box {...boxProps}>
        <VAIcon fill={theme.colors.icon.pagination} width={16} height={16} preventScaling={true} {...iconProps} />
      </Box>
    </Pressable>
  )
}

const Pagination: FC<PaginationProps> = ({ page, pageSize, totalEntries, onPrev, onNext }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.COMMON)

  const boxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: theme.dimensions.touchableMinHeight,
  }

  const previousProps: PaginationArrowProps = {
    onPress: onPrev,
    testID: 'previous-page',
    a11yHint: t('pagination.previous'),
    iconProps: { name: 'ArrowLeft', fill: theme.colors.icon.pagination },
    disabled: page === 1,
  }

  const nextProps: PaginationArrowProps = {
    onPress: onNext,
    testID: 'next-page',
    a11yHint: t('pagination.next'),
    iconProps: { name: 'ArrowRight', fill: theme.colors.icon.pagination },
    disabled: page * pageSize >= totalEntries,
  }
  const beginIdx = (page - 1) * pageSize + 1
  let endIdx = page * pageSize
  // if more than total entries then calculate actual index
  if (endIdx > totalEntries) {
    endIdx = endIdx - (endIdx - totalEntries)
  }

  if (totalEntries <= pageSize) {
    return <></>
  }

  return (
    <Box {...boxProps}>
      <PaginationArrow {...previousProps} />
      <TextView flex={1} variant={'MobileBody'} px={theme.dimensions.buttonPadding} textAlign={'center'}>
        {t('pagination.info', { beginIdx, endIdx, totalEntries })}
      </TextView>
      <PaginationArrow {...nextProps} />
    </Box>
  )
}

export default Pagination

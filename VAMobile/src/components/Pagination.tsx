import React, { FC } from 'react'

import { NAMESPACE } from '../constants/namespaces'
import { Pressable, PressableProps } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

export type PaginationProps = {
  /** item name */
  itemName: string
  /** page number */
  page: number
  /** number of items */
  curNumberOfItems: number
  /** pageSize */
  pageSize: number
  /** function to update currentPage*/
  setPage: (latestPage: number) => void
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

const Pagination: FC<PaginationProps> = ({ itemName, page, pageSize, curNumberOfItems, setPage }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.COMMON)

  const boxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: theme.dimensions.touchableMinHeight,
  }

  const onPrevious = (): void => {
    setPage(page - 1)
  }

  const onNext = (): void => {
    setPage(page + 1)
  }

  const previousProps: PaginationArrowProps = {
    onPress: onPrevious,
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
    disabled: page > 1 && curNumberOfItems < pageSize,
  }

  const beginIdx = (page - 1) * pageSize + 1
  const endIdx = page * pageSize - (pageSize - curNumberOfItems)

  if (page === 1 && curNumberOfItems < pageSize) {
    return <></>
  }

  return (
    <Box {...boxProps}>
      <PaginationArrow {...previousProps} />
      <TextView variant={'MobileBody'} px={theme.dimensions.buttonPadding} textAlign={'center'}>
        {t('pagination.info', { itemName, beginIdx, endIdx })}
      </TextView>
      <PaginationArrow {...nextProps} />
    </Box>
  )
}

export default Pagination

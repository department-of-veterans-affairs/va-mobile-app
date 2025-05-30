import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps } from 'react-native'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'

import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'

import Box, { BoxProps } from './Box'
import TextView from './TextView'

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
  /** optional tab if screen has tabs for analytics */
  tab?: string
}

type PaginationArrowProps = {
  /** function called when pressed */
  onPress: () => void
  /** optional accessibility label */
  a11yLabel?: string
  /** whether or not this button is disabled */
  disabled: boolean
  /** test id */
  testID: string
  /** props for icon */
  iconProps: IconProps
}

export const PaginationArrow: FC<PaginationArrowProps> = ({ onPress, a11yLabel, iconProps, testID, disabled }) => {
  const theme = useTheme()

  const pressableProps: PressableProps = {
    onPress: onPress,
    accessibilityRole: 'link',
    disabled,
    accessible: true,
    accessibilityState: disabled ? { disabled: true } : {},
  }

  const boxProps: BoxProps = {
    backgroundColor: disabled ? 'buttonSecondaryDisabled' : 'buttonPrimary',
    minHeight: theme.dimensions.touchableMinHeight,
    p: 5,
    borderRadius: 5,
  }
  return (
    // eslint-disable-next-line react-native-a11y/has-accessibility-hint
    <Pressable {...pressableProps} testID={testID} accessibilityLabel={a11yLabel}>
      <Box {...boxProps}>
        <Icon fill={theme.colors.icon.pagination} width={36} height={36} preventScaling={true} {...iconProps} />
      </Box>
    </Pressable>
  )
}
/**A common component for showing pagination on the page. Displays previous arrow, next arrow, and copy message based on current page and item. */
const Pagination: FC<PaginationProps> = ({ page, pageSize, totalEntries, onPrev, onNext, tab }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const boxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: theme.dimensions.touchableMinHeight,
  }

  const onPrevPress = () => {
    logAnalyticsEvent(Events.vama_pagination(page, page - 1, tab))
    onPrev()
  }

  const onNextPress = () => {
    logAnalyticsEvent(Events.vama_pagination(page, page + 1, tab))
    onNext()
  }

  const previousProps: PaginationArrowProps = {
    onPress: onPrevPress,
    testID: 'previous-page',
    a11yLabel: t('pagination.previous'),
    iconProps: { name: 'ChevronLeft', fill: theme.colors.icon.pagination },
    disabled: page === 1,
  }

  const nextProps: PaginationArrowProps = {
    onPress: onNextPress,
    testID: 'next-page',
    a11yLabel: t('pagination.next'),
    iconProps: { name: 'ChevronRight', fill: theme.colors.icon.pagination },
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

import { AccessibilityProps, AccessibilityRole, AccessibilityState, Pressable, PressableProps } from 'react-native'
import React, { FC, ReactElement } from 'react'

import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box, { BackgroundVariant, BoxProps } from './Box'
import SwitchComponent, { SwitchProps } from './Switch'
import VAIcon, { VAIconProps } from './VAIcon'

/** Decorator type for the button, defaults to Navigation (right arrow) */
export enum ButtonDecoratorType {
  /** Switch button decorator */
  Switch = 'Switch',
  /** Navigation arrow decorator */
  Navigation = 'Navigation',
  /** No decorator */
  None = 'None',
  /** Picker selected item decorator **/
  SelectedItem = 'SelectedItem',
}

export type ListItemDecoratorProps = Partial<VAIconProps> | Partial<SwitchProps>

/**
 * Props for BaseListItem
 */
export type BaseListItemProps = {
  /** test id string also used for the accessibility label */
  testId?: string

  /** The a11y hint text */
  a11yHint: string

  /** optional a11y text value */
  a11yValue?: string

  /** optional accessibility role. By default it will be button */
  a11yRole?: AccessibilityRole

  /** optional accessibility state **/
  a11yState?: AccessibilityState

  /** onPress callback */
  onPress?: () => void

  /** Decorator Type to use */
  decorator?: ButtonDecoratorType

  /** Optional props to be passed to the decorator */
  decoratorProps?: ListItemDecoratorProps

  /** Optional child elements to use instead of listOfText if you need to do special styling */
  children?: React.ReactNode

  /** Optional background color for an individual item **/
  backgroundColor?: BackgroundVariant
}

const ButtonDecorator: FC<{ decorator?: ButtonDecoratorType; decoratorProps?: ListItemDecoratorProps; onPress: () => void }> = ({ decorator, decoratorProps, onPress }) => {
  const theme = useTheme()

  switch (decorator) {
    case ButtonDecoratorType.Switch:
      return <SwitchComponent onPress={onPress} {...decoratorProps} />
    case ButtonDecoratorType.SelectedItem:
      return (
        <VAIcon
          name={'CheckMark'}
          height={theme.dimensions.pickerModalSelectedIconHeight}
          width={theme.dimensions.pickerModalSelectedIconWidth}
          fill={theme.colors.icon.grayDark}
          {...decoratorProps}
        />
      )
    default:
      return <VAIcon name={'ArrowRight'} fill="#999999" width={10} height={15} {...decoratorProps} />
  }
}

/**
 * Reusable component for menu items that take up the full width of the screen that is touchable.
 * @returns BaseListItem component
 */
const BaseListItem: FC<BaseListItemProps> = (props) => {
  const { onPress, a11yHint, a11yRole, a11yState, decorator, decoratorProps, testId, a11yValue, children, backgroundColor } = props
  const theme = useTheme()

  const isSwitchRow = decorator === ButtonDecoratorType.Switch
  const showDecorator = onPress && decorator !== ButtonDecoratorType.None

  const background = backgroundColor ? backgroundColor : 'list'

  const onOuterPress = (): void => {
    // nooop for switch types, need to press on the switch specifically
    if (onPress) {
      onPress()
    }
  }

  const onDecoratorPress = (): void => {
    // if we're a switch type, need to handle the press on the decorator specifically
    if (isSwitchRow && onPress) {
      onPress()
    }
  }

  // Default role for list item is button
  const accessibilityRole = a11yRole || (isSwitchRow ? 'switch' : 'button')

  const pressableProps: PressableProps = {
    onPress: onOuterPress,
    accessible: true,
    accessibilityRole,
  }

  const boxProps: BoxProps = {
    width: '100%',
    minHeight: theme.dimensions.touchableMinHeight,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    borderBottomWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: background,
  }

  const a11yProps: AccessibilityProps = {
    ...testIdProps(testId || ''),
    ...a11yHintProp(a11yHint),
    accessibilityValue: a11yValue ? { text: a11yValue } : {},
    accessibilityState: a11yState ? a11yState : {},
  }

  if (isSwitchRow && decoratorProps) {
    a11yProps.accessibilityState = {
      ...a11yProps.accessibilityState,
      checked: (decoratorProps as Partial<SwitchProps>).on,
    }
  }

  const generateItem = (accessibilityProps?: AccessibilityProps): ReactElement => {
    // accessible property set to true when there is no onPress because it is already wrapped in the accessible Pressable
    return (
      <Box {...boxProps} {...accessibilityProps} accessible={!onPress}>
        {children}
        {showDecorator && (
          <Box ml={theme.dimensions.listItemDecoratorMarginLeft}>
            <ButtonDecorator decorator={decorator} onPress={onDecoratorPress} decoratorProps={decoratorProps} />
          </Box>
        )}
      </Box>
    )
  }

  // onPress exist, wrap in Pressable and apply a11yProps
  if (onPress) {
    return (
      <Pressable {...a11yProps} {...pressableProps}>
        {generateItem()}
      </Pressable>
    )
  }

  // apply a11yProps if onPress does not exist
  return generateItem(a11yProps)
}

export default BaseListItem

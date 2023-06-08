import { AccessibilityProps, AccessibilityRole, AccessibilityState, Pressable, PressableProps } from 'react-native'
import React, { FC, ReactElement, useState } from 'react'

import { a11yHintProp, a11yValueProp, testIdProps } from 'utils/accessibility'
import { triggerHaptic } from 'utils/haptics'
import { useTheme } from 'utils/hooks'
import Box, { BackgroundVariant, BoxProps } from './Box'
import FileRequestNumberIndicator from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestNumberIndicator'
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
  /** Trash can decorator */
  Delete = 'Delete',
  /** Empty radio button decorator */
  RadioEmpty = 'RadioEmpty',
  /** Filled radio button decorator */
  RadioFilled = 'RadioFilled',
  /** Disabled radio button decorator */
  RadioDisabled = 'RadioDisabled',
  /** Empty check box button decorator */
  CheckBoxEmpty = 'CheckBoxEmpty',
  /** Filled check box button decorator */
  CheckBoxFilled = 'CheckBoxFilled',
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

  /** optional accessibility state */
  a11yState?: AccessibilityState

  /** onPress callback */
  onPress?: () => void

  /** Decorator Type to use */
  decorator?: ButtonDecoratorType

  /** Optional props to be passed to the decorator */
  decoratorProps?: ListItemDecoratorProps

  /** Optional child elements to use instead of listOfText if you need to do special styling */
  children?: React.ReactNode

  /** Optional background color for an individual item */
  backgroundColor?: BackgroundVariant

  /** Optional active background color for an individual item */
  activeBackgroundColor?: BackgroundVariant

  /** Optional file request number for the number indicator */
  claimsRequestNumber?: number

  /** Optional file request if file was loaded to show check mark */
  fileUploaded?: boolean

  /** Optional min height */
  minHeight?: number
}

export const ButtonDecorator: FC<{ decorator?: ButtonDecoratorType; decoratorProps?: ListItemDecoratorProps; onPress?: () => void }> = ({ decorator, decoratorProps, onPress }) => {
  const theme = useTheme()
  const radioBtnWidth = 22
  const radioBtnHeight = 22

  const switchOnPress = onPress ? onPress : () => {}

  switch (decorator) {
    case ButtonDecoratorType.Switch:
      return <SwitchComponent onPress={switchOnPress} {...decoratorProps} />
    case ButtonDecoratorType.SelectedItem:
      return <VAIcon name={'CheckMark'} height={13} width={16} fill={theme.colors.icon.pickerIcon} {...decoratorProps} />
    case ButtonDecoratorType.Delete:
      return <VAIcon name={'Trash'} height={16} width={14} fill={theme.colors.icon.error} {...decoratorProps} />
    case ButtonDecoratorType.RadioFilled:
      return <VAIcon name={'RadioFilled'} height={radioBtnHeight} width={radioBtnWidth} fill={theme.colors.icon.checkboxEnabledPrimary} {...decoratorProps} />
    case ButtonDecoratorType.RadioEmpty:
      return (
        <VAIcon
          name={'RadioEmpty'}
          height={radioBtnHeight}
          width={radioBtnWidth}
          fill={theme.colors.icon.checkboxDisabledContrast}
          stroke={theme.colors.icon.checkboxDisabled}
          {...decoratorProps}
        />
      )
    case ButtonDecoratorType.RadioDisabled:
      return (
        <VAIcon
          name={'RadioEmpty'}
          height={radioBtnHeight}
          width={radioBtnWidth}
          fill={theme.colors.icon.radioDisabled}
          stroke={theme.colors.icon.checkboxDisabled}
          {...decoratorProps}
        />
      )
    case ButtonDecoratorType.CheckBoxFilled:
      return <VAIcon name={'CheckBoxFilled'} height={radioBtnHeight} width={radioBtnWidth} fill={theme.colors.icon.checkboxEnabledPrimary} {...decoratorProps} />
    case ButtonDecoratorType.CheckBoxEmpty:
      return (
        <VAIcon
          name={'CheckBoxEmpty'}
          height={radioBtnHeight}
          width={radioBtnWidth}
          fill={theme.colors.icon.checkboxDisabledContrast}
          stroke={theme.colors.icon.checkboxDisabled}
          {...decoratorProps}
        />
      )

    default:
      return (
        <VAIcon
          name={'ChevronRight'}
          fill={theme.colors.icon.chevronListItem}
          width={theme.dimensions.chevronListItemWidth}
          height={theme.dimensions.chevronListItemHeight}
          {...decoratorProps}
        />
      )
  }
}

/**
 * Reusable component for menu items that take up the full width of the screen that is touchable.
 * @returns BaseListItem component
 */
const BaseListItem: FC<BaseListItemProps> = (props) => {
  const {
    onPress,
    a11yHint,
    a11yRole,
    a11yState,
    decorator,
    decoratorProps,
    testId,
    a11yValue,
    children,
    backgroundColor,
    activeBackgroundColor,
    claimsRequestNumber,
    fileUploaded,
    minHeight,
  } = props
  const theme = useTheme()

  const [isPressed, setIsPressed] = useState(false)

  const _onPressIn = (): void => {
    setIsPressed(true)
  }

  const _onPressOut = (): void => {
    setIsPressed(false)
  }
  const isSwitchRow = decorator === ButtonDecoratorType.Switch
  const showDecorator = onPress && decorator !== ButtonDecoratorType.None

  const background = backgroundColor ? backgroundColor : 'list'
  const activeBackground = activeBackgroundColor ? activeBackgroundColor : 'listActive'

  const onOuterPress = (): void => {
    // nooop for switch types, need to press on the switch specifically
    if (onPress) {
      if (isSwitchRow) {
        triggerHaptic('impactHeavy')
      }
      onPress()
    }
  }

  const onDecoratorPress = (): void => {
    // if we're a switch type, need to handle the press on the decorator specifically
    if (isSwitchRow && onPress) {
      triggerHaptic('impactHeavy')
      onPress()
    }
  }

  // Default role for list item is button
  const accessibilityRole = a11yRole || (isSwitchRow ? 'switch' : 'button')

  const pressableProps: PressableProps = {
    onPress: onOuterPress,
    onPressIn: _onPressIn,
    onPressOut: _onPressOut,
    accessible: true,
    accessibilityRole,
    disabled: decorator === ButtonDecoratorType.RadioDisabled,
  }

  const boxProps: BoxProps = {
    width: '100%',
    minHeight: minHeight || theme.dimensions.touchableMinHeight,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    borderBottomWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isPressed ? activeBackground : background,
  }

  const a11yProps: AccessibilityProps = {
    ...testIdProps(testId || ''),
    ...a11yHintProp(a11yHint),
    ...a11yValueProp(a11yValue ? { text: a11yValue } : {}),
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
        {claimsRequestNumber !== undefined ? <FileRequestNumberIndicator requestNumber={claimsRequestNumber} fileUploaded={fileUploaded} /> : <></>}
        {children}
        {showDecorator && (
          <Box ml={theme.dimensions.listItemDecoratorMarginLeft} importantForAccessibility={'no-hide-descendants'}>
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

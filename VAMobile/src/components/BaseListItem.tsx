import React, { FC, ReactElement, useState } from 'react'
import { AccessibilityProps, AccessibilityRole, AccessibilityState, Pressable, PressableProps } from 'react-native'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import FileRequestNumberIndicator from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestNumberIndicator'
import { a11yHintProp, a11yValueProp } from 'utils/accessibility'
import { triggerHaptic } from 'utils/haptics'
import { useTheme } from 'utils/hooks'

import Box, { BackgroundVariant, BoxProps } from './Box'
import SwitchComponent, { SwitchProps } from './Switch'

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
  RadioEmpty = 'RadioButtonUnchecked',
  /** Filled radio button decorator */
  RadioFilled = 'RadioButtonChecked',
  /** Disabled radio button decorator */
  RadioDisabled = 'RadioDisabled', // no equivalent??
  /** Empty check box button decorator */
  CheckBoxEmpty = 'CheckBoxOutlineBlank',
  /** Filled check box button decorator */
  CheckBoxFilled = 'CheckBox',
}

export type ListItemDecoratorProps = Partial<IconProps> | Partial<SwitchProps>

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

  /** test id string for detox */
  detoxTestID?: string
}

export const ButtonDecorator: FC<{
  decorator?: ButtonDecoratorType
  decoratorProps?: ListItemDecoratorProps
  onPress?: () => void
}> = ({ decorator, decoratorProps, onPress }) => {
  const theme = useTheme()
  const radioBtnWidth = 22
  const radioBtnHeight = 22

  const buttonSelectedFill =
    theme.mode === 'dark' ? colors.vadsColorFormsForegroundActiveOnDark : colors.vadsColorFormsForegroundActiveOnLight
  const buttonUnselectedFill =
    theme.mode === 'dark' ? colors.vadsColorFormsBorderDefaultOnDark : colors.vadsColorFormsBorderDefaultOnLight

  const switchOnPress = onPress ? onPress : () => {}

  switch (decorator) {
    case ButtonDecoratorType.Switch:
      return <SwitchComponent onPress={switchOnPress} {...decoratorProps} />
    case ButtonDecoratorType.SelectedItem:
      return <Icon name={'Check'} height={13} width={16} fill={theme.colors.icon.pickerIcon} />
    case ButtonDecoratorType.Delete:
      return <Icon name={'Delete'} height={16} width={14} fill={theme.colors.icon.error} />
    case ButtonDecoratorType.RadioFilled:
      return (
        <Icon name={'RadioButtonChecked'} height={radioBtnHeight} width={radioBtnWidth} fill={buttonSelectedFill} />
      )
    case ButtonDecoratorType.RadioEmpty:
      return (
        <Icon name={'RadioButtonUnchecked'} height={radioBtnHeight} width={radioBtnWidth} fill={buttonUnselectedFill} />
      )
    case ButtonDecoratorType.RadioDisabled:
      return (
        <Icon
          name={'RadioButtonUnchecked'}
          height={radioBtnHeight}
          width={radioBtnWidth}
          fill={theme.colors.icon.radioDisabled}
        />
      )
    case ButtonDecoratorType.CheckBoxFilled:
      return (
        <Icon
          name={'CheckBox'}
          height={radioBtnHeight}
          width={radioBtnWidth}
          fill={theme.colors.icon.checkboxEnabledPrimary}
        />
      )
    case ButtonDecoratorType.CheckBoxEmpty:
      return (
        <Icon
          name={'CheckBoxOutlineBlank'}
          height={radioBtnHeight}
          width={radioBtnWidth}
          fill={theme.colors.icon.checkboxDisabledContrast}
        />
      )

    default:
      return (
        <Icon
          name={'ChevronRight'}
          fill={theme.colors.icon.chevronListItem}
          width={theme.dimensions.chevronListItemWidth}
          height={theme.dimensions.chevronListItemHeight}
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
    detoxTestID,
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
        triggerHaptic(HapticFeedbackTypes.impactHeavy)
      }
      onPress()
    }
  }

  const onDecoratorPress = (): void => {
    // if we're a switch type, need to handle the press on the decorator specifically
    if (isSwitchRow && onPress) {
      triggerHaptic(HapticFeedbackTypes.impactHeavy)
      onPress()
    }
  }

  // Default role for list item is menuitem
  const accessibilityRole = a11yRole || (isSwitchRow ? 'switch' : 'link')

  const pressableProps: PressableProps = {
    onPress: onOuterPress,
    onPressIn: _onPressIn,
    onPressOut: _onPressOut,
    accessible: true,
    disabled: decorator === ButtonDecoratorType.RadioDisabled,
  }

  const boxProps: BoxProps = {
    width: '100%',
    minHeight: minHeight || theme.dimensions.touchableMinHeight,
    py: theme.dimensions.buttonPadding,
    pl: theme.dimensions.gutter,
    pr: decorator === undefined ? theme.dimensions.buttonPadding : theme.dimensions.gutter,
    borderBottomWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isPressed ? activeBackground : background,
  }

  const a11yProps: AccessibilityProps = {
    ...a11yHintProp(a11yHint),
    ...a11yValueProp(a11yValue ? { text: a11yValue } : {}),
    accessibilityState: a11yState ? a11yState : {},
    accessibilityLabel: testId,
    accessibilityRole: onPress ? accessibilityRole : 'text',
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
      <Box {...boxProps} {...accessibilityProps} testID={accessibilityProps?.accessibilityLabel} accessible={!onPress}>
        {claimsRequestNumber !== undefined ? (
          <FileRequestNumberIndicator requestNumber={claimsRequestNumber} fileUploaded={fileUploaded} />
        ) : (
          <></>
        )}
        {children}
        {showDecorator && (
          <Box
            ml={decorator === undefined ? 0 : theme.dimensions.listItemDecoratorMarginLeft}
            importantForAccessibility={'no-hide-descendants'}>
            <ButtonDecorator decorator={decorator} onPress={onDecoratorPress} decoratorProps={decoratorProps} />
          </Box>
        )}
      </Box>
    )
  }

  // onPress exist, wrap in Pressable and apply a11yProps
  if (onPress) {
    return (
      <Pressable {...a11yProps} {...pressableProps} testID={detoxTestID}>
        {generateItem()}
      </Pressable>
    )
  }

  // apply a11yProps if onPress does not exist
  return generateItem(a11yProps)
}

export default BaseListItem

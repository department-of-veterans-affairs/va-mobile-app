import { AccessibilityProps, Pressable, PressableProps } from 'react-native'
import React, { FC, ReactElement } from 'react'

import _ from 'underscore'

import { TextLine } from './types'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { useTheme } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import SwitchComponent, { SwitchProps } from './Switch'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'
import getEnv from 'utils/env'

/** Decorator type for the button, defaults to Navigation (right arrow) */
export enum ButtonDecoratorType {
  /** Switch button decorator */
  Switch = 'Switch',
  /** Navigation arrow decorator */
  Navigation = 'Navigation',
  /** No decorator */
  None = 'None',
}

export type ListItemDecoratorProps = Partial<VAIconProps> | Partial<SwitchProps>

/**
 * Props for ListItem
 */
export type ListItemProps = {
  /** List of text for the button */
  listOfText?: Array<TextLine>

  /** optional test id string, if not supplied will generate one from first line of text */
  testId?: string

  /** The ally1 hint text */
  a11yHint: string

  /** optional a11y text value */
  a11yValue?: string

  /** onPress callback */
  onPress?: () => void

  /** Decorator Type to use */
  decorator?: ButtonDecoratorType

  /** Optional props to be passed to the decorator */
  decoratorProps?: ListItemDecoratorProps

  /** Optional child elements to use instead of listOfText if you need to do special styling */
  children?: React.ReactNode
}

const ButtonDecorator: FC<{ decorator?: ButtonDecoratorType; decoratorProps?: ListItemDecoratorProps; onPress: () => void }> = ({ decorator, decoratorProps, onPress }) => {
  switch (decorator) {
    case ButtonDecoratorType.Switch:
      return <SwitchComponent onPress={onPress} {...decoratorProps} />
    default:
      return <VAIcon name={'ArrowRight'} fill="#999999" width={10} height={15} {...decoratorProps} />
  }
}

/**
 * Reusable component for menu items that take up the full width of the screen that is touchable.
 * @returns ListItem component
 */
const ListItem: FC<ListItemProps> = (props) => {
  const { listOfText, onPress, a11yHint, decorator, decoratorProps, testId, a11yValue, children } = props
  const theme = useTheme()

  const isSwitchRow = decorator === ButtonDecoratorType.Switch
  const showDecorator = onPress && decorator !== ButtonDecoratorType.None

  const listOfTextID: Array<string> = []
  if (listOfText) {
    _.forEach(listOfText, (listOfTextItem) => {
      listOfTextID.push(listOfTextItem.text)
    })
  }

  const viewTestId = testId ? testId : generateTestID(listOfText ? listOfTextID.join(' ') : '', '')

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

  const pressableProps: PressableProps = {
    onPress: onOuterPress,
    accessible: true,
    accessibilityRole: isSwitchRow ? 'switch' : 'button',
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
  }

  const a11yProps: AccessibilityProps = {
    ...testIdProps(viewTestId),
    ...a11yHintProp(a11yHint),
    accessibilityValue: a11yValue ? { text: a11yValue } : {},
  }

  if (isSwitchRow && decoratorProps) {
    a11yProps.accessibilityState = {
      checked: (decoratorProps as Partial<SwitchProps>).on,
    }
  }

  const generateItem = (accessibilityProps: AccessibilityProps): ReactElement => {
    return (
      <Box {...boxProps} {...accessibilityProps} accessible={true}>
        <Box flex={1}>
          <Box flexDirection="column">
            {listOfText?.map((textObj, index) => {
              const { text, variant = 'MobileBody', color = 'primary', textAlign = 'left' } = textObj

              return (
                <TextView variant={variant} textAlign={textAlign} color={color} key={index} testID={text + '-title'}>
                  {text}
                </TextView>
              )
            })}
          </Box>
        </Box>
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
      <Pressable testID={viewTestId + '-pressable'} {...pressableProps}>
        {generateItem(a11yProps)}
      </Pressable>
    )
  }

  // apply a11yProps if onPress does not exist
  return generateItem(a11yProps)
}

export default ListItem

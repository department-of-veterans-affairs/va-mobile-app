import { AccessibilityProps, Pressable, PressableProps } from 'react-native'
import React, { FC, ReactElement } from 'react'

import _ from 'underscore'

import { TextLine } from './types'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { isIOS } from 'utils/platform'
import { useTheme } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import SwitchComponent, { SwitchProps } from './Switch'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

/** Decorator type for the button, defaults to Navigation (right arrow) */
export enum ButtonDecoratorType {
  /** Switch button decorator */
  Switch = 'Switch',
  /** Navigation arrow decorator */
  Navigation = 'Navigation',
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

  /** onPress callback */
  onPress?: () => void

  /** Decorator Type to use */
  decorator?: ButtonDecoratorType

  /** Optional props to be passed to the decorator */
  decoratorProps?: ListItemDecoratorProps

  /** Optional child elements to use insetead of listOfText if you need to do special styling */
  children?: React.ReactNode
}

const ButtonDecorator: FC<{ decorator?: ButtonDecoratorType; decoratorProps?: ListItemDecoratorProps; onPress: () => void }> = ({ decorator, decoratorProps, onPress }) => {
  const theme = useTheme()

  switch (decorator) {
    case ButtonDecoratorType.Switch:
      return (
        <Box ml={theme.dimensions.switchMarginLeft}>
          <SwitchComponent onPress={onPress} {...decoratorProps} />
        </Box>
      )
    default:
      return <VAIcon name={'ArrowRight'} fill="#999999" width={10} height={15} {...decoratorProps} />
  }
}

/**
 * Reusable component for menu items that take up the full width of the screen that is touchable.
 * @returns ListItem component
 */
const ListItem: FC<ListItemProps> = (props) => {
  const { listOfText, onPress, a11yHint, decorator, decoratorProps, testId, children } = props

  const isSwitchRow = decorator === ButtonDecoratorType.Switch

  const listOfTextID: Array<string> = []
  if (listOfText) {
    _.forEach(listOfText, (listOfTextItem) => {
      listOfTextID.push(listOfTextItem.text)
    })
  }

  const viewTestId = testId ? testId : generateTestID(listOfText ? listOfTextID.join(' ') : '', '')

  const onOuterPress = (): void => {
    // nooop for switch types, need to press on the switch specifically
    if (onPress && !(isSwitchRow && isIOS())) {
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
    disabled: isSwitchRow && isIOS(),
    onPress: onOuterPress,
    accessible: true,
    accessibilityRole: 'menuitem',
  }

  const boxProps: BoxProps = {
    width: '100%',
    minHeight: 44,
    py: 10,
    px: 20,
    borderBottomWidth: 1,
    borderColor: 'primary',
    borderStyle: 'solid',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  }

  const a11yProps: AccessibilityProps = {
    ...testIdProps(viewTestId),
    ...a11yHintProp(a11yHint),
  }

  const generateItem = (accessibilityProps: AccessibilityProps): ReactElement => {
    return (
      <Box {...boxProps} {...accessibilityProps}>
        <Box flex={1}>
          <Box flexDirection="column">
            {listOfText?.map((textObj, index) => {
              const { text, isBold, color } = textObj
              const variant = isBold ? 'MobileBodyBold' : undefined

              return (
                <TextView variant={variant} color={color || 'primary'} {...testIdProps(text + '-title')} key={index}>
                  {text}
                </TextView>
              )
            })}
          </Box>
        </Box>
        {children}
        {onPress && <ButtonDecorator decorator={decorator} onPress={onDecoratorPress} decoratorProps={decoratorProps} />}
      </Box>
    )
  }

  // onPress exist, wrap in Pressable and apply a11yProps
  if (onPress) {
    return (
      <Pressable {...a11yProps} {...pressableProps}>
        {generateItem({})}
      </Pressable>
    )
  }

  // apply a11yProps if onPress does not exist
  return generateItem(a11yProps)
}

export default ListItem

import React, { FC, useState } from 'react'

import { TouchableWithoutFeedback } from 'react-native'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps, VA_ICON_MAP } from './VAIcon'

export type CollapsibleViewProps = {
  text: string
}

/**
 * CollapsibleView that shows up on the HomeScreen' and 'Contact VA' option on HomeScreen
 *
 * @returns CollapsibleView component
 */
const CollapsibleView: FC<CollapsibleViewProps> = ({ text, children }) => {
  const [expanded, setExpanded] = useState(false)

  const onPress = (): void => {
    setExpanded(!expanded)
  }

  const textWrapper: BoxProps = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'secondary',
    alignSelf: 'flex-start',
  }

  const underlineProps = {}

  const expandedAreaProps: BoxProps = {
    display: expanded ? 'flex' : 'none',
  }

  const getArrowIcon = (): Element => {
    const iconProps: VAIconProps = {
      fill: '#000000',
      name: expanded ? 'ArrowUp' : 'ArrowDown',
      width: 9,
      height: 7,
    }
    return <VAIcon {...iconProps} />
  }

  return (
    <Box>
      <TouchableWithoutFeedback onPress={onPress} style={{ paddingTop: '11px', paddingBottom: '11px' }}>
        <Box {...textWrapper}>
          <TextView variant={'MobileBody'} mr={5}>
            {text}
          </TextView>
          {getArrowIcon()}
          <Box />
        </Box>
      </TouchableWithoutFeedback>
      <Box {...expandedAreaProps}>{children}</Box>
    </Box>
  )
}

export default CollapsibleView

import React, { FC, useState } from 'react'

import { TextArea } from './index'
import { TouchableWithoutFeedback } from 'react-native'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

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
    <TextArea>
      <TouchableWithoutFeedback onPress={onPress}>
        <Box minHeight={48}>
          <Box {...textWrapper}>
            <TextView variant={'MobileBody'} mr={5}>
              {text}
            </TextView>
            {getArrowIcon()}
            <Box />
          </Box>
        </Box>
      </TouchableWithoutFeedback>
      <Box {...expandedAreaProps}>{children}</Box>
    </TextArea>
  )
}

export default CollapsibleView

import React, { FC, useState } from 'react'

import { TouchableWithoutFeedback } from 'react-native'
import { useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon from './VAIcon'

export type CollapsibleViewProps = {
  text: string
}

/**
 * CollapsibleView that shows up on the HomeScreen' and 'Contact VA' option on HomeScreen
 *
 * @returns CollapsibleView component
 */
const CollapsibleView: FC<CollapsibleViewProps> = ({ text, children }) => {
  const t = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const onPress = (): void => {
    setExpanded(!expanded)
  }

  const textWrapper: BoxProps = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    minHeight: 44,
  }

  const expandedAreaProps: BoxProps = {
    height: expanded ? 'auto' : 0,
  }

  return (
    <Box>
      <TouchableWithoutFeedback onPress={onPress}>
        <Box {...textWrapper}>
          <TextView variant={'MobileBody'} mr={5}>
            {text}
          </TextView>
          <Box />
          <Box transform={expanded ? 'rotate(180deg)' : ''}>
            <VAIcon name={'ArrowDown'} fill={'#000000'} />
          </Box>
        </Box>
      </TouchableWithoutFeedback>
      <Box {...expandedAreaProps}>{children}</Box>
    </Box>
  )
}

export default CollapsibleView

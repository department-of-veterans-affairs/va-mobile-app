import React, { FC, useState } from 'react'

import { TextArea } from './index'
import { TouchableWithoutFeedback } from 'react-native'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

/**
 * Signifies props passed into {@link CollapsibleView}
 */
export type CollapsibleViewProps = {
  /** text displayed on the touchable */
  text: string
}

/**
 * CollapsibleView that on click reveals content, which is hidden again on another click
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

  const getArrowIcon = (): React.ReactNode => {
    const iconProps: VAIconProps = {
      fill: '#000000',
      name: expanded ? 'ArrowUp' : 'ArrowDown',
      width: 9,
      height: 7,
    }
    return <VAIcon {...iconProps} />
  }

  return (
    <TextArea padding={{ pt: 17, pl: 20 }}>
      <TouchableWithoutFeedback {...testIdProps(generateTestID(text, ''))} onPress={onPress} accessibilityState={{ expanded }}>
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
      {expanded && <Box>{children}</Box>}
    </TextArea>
  )
}

export default CollapsibleView

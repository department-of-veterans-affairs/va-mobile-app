import React, { FC, useState } from 'react'

import { TextArea } from './index'
import { TouchableWithoutFeedback } from 'react-native'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
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
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const onPress = (): void => {
    setExpanded(!expanded)
  }

  const textWrapper: BoxProps = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottomWidth: theme.dimensions.borderWidth,
    borderBottomColor: 'secondary',
    alignSelf: 'flex-start',
  }

  const getArrowIcon = (): React.ReactNode => {
    const iconProps: VAIconProps = {
      fill: 'expandCollapse',
      name: expanded ? 'ArrowUp' : 'ArrowDown',
      width: 9,
      height: 7,
    }
    return <VAIcon {...iconProps} />
  }

  return (
    <TextArea>
      <TouchableWithoutFeedback {...testIdProps(generateTestID(text, ''))} onPress={onPress} accessibilityState={{ expanded }}>
        <Box minHeight={48}>
          <Box {...textWrapper}>
            <TextView variant={'MobileBody'} mr={theme.dimensions.textIconMargin}>
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

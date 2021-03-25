import { Pressable, PressableProps } from 'react-native'
import React, { FC, ReactNode, useState } from 'react'

import { Box, TextArea, VAIcon, VA_ICON_MAP } from './index'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type AccordionCollapsibleProps = {
  header: ReactNode
  expandedContent: ReactNode
  testID?: string
  collapsedContent?: ReactNode
  hideArrow?: boolean
}

const AccordionCollapsible: FC<AccordionCollapsibleProps> = ({ header, expandedContent, collapsedContent, hideArrow, testID, children }) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const pressableProps: PressableProps = {
    onPress: (): void => setExpanded(!expanded),
    accessibilityState: { expanded },
    accessibilityHint: t('viewMoreDetails'),
    accessibilityRole: 'spinbutton',
  }

  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ArrowUp' : 'ArrowDown'

  const renderHeader = () => {
    const data = (
      <Box flexDirection="row">
        <Box flex={1}>{header}</Box>
        {!hideArrow && (
          <Box mt={theme.dimensions.condensedMarginBetween}>
            <VAIcon name={iconName} fill={'#000'} width={16} height={10} />
          </Box>
        )}
      </Box>
    )

    if (hideArrow) {
      return <Box {...testIdProps(testID || '')}>{data}</Box>
    }

    return (
      <Pressable {...pressableProps} {...testIdProps(testID || '')}>
        {data}
      </Pressable>
    )
  }

  return (
    <TextArea>
      {renderHeader()}
      {!expanded && collapsedContent}
      {expanded && expandedContent}
      {children}
    </TextArea>
  )
}

export default AccordionCollapsible

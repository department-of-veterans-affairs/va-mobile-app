import { Pressable, PressableProps } from 'react-native'
import React, { FC, ReactNode, useState } from 'react'

import { Box, BoxProps, TextArea, VAIcon, VA_ICON_MAP } from './index'
import { NAMESPACE } from 'constants/namespaces'
import { VABorderColors } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type AccordionCollapsibleProps = {
  /** component to display as header of accordion */
  header: ReactNode
  /** component to display only when the accordion is expanded */
  expandedContent: ReactNode
  /** testID for the header */
  testID?: string
  /** component to display on when the accordion is collapsed */
  collapsedContent?: ReactNode
  /** if true hides the accordion arrow and only displays header & collapsed content */
  hideArrow?: boolean
  /** custom on press call if more action is needed when expanding/collapsing the accordion */
  customOnPress?: (expandedValue?: boolean) => void
  /** sets the initial value of expanded if an accordion should already be expanded on render */
  expandedInitialValue?: boolean
  /** gets rid of border of TextArea so the top and bottom borders don't double up in message threads when accordion is opened */
  noBorder?: boolean
  /** applies a border to create the alert effect on the view **/
  alertBorder?: keyof VABorderColors
}

const AccordionCollapsible: FC<AccordionCollapsibleProps> = ({
  header,
  expandedContent,
  collapsedContent,
  hideArrow,
  testID,
  customOnPress,
  expandedInitialValue,
  noBorder,
  children,
  alertBorder,
}) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [expanded, setExpanded] = useState(expandedInitialValue || false)

  const onPress = (): void => {
    if (customOnPress) {
      customOnPress(!expanded)
    }

    setExpanded(!expanded)
  }

  const pressableProps: PressableProps = {
    onPress,
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
            <VAIcon name={iconName} fill={theme.colors.icon.chevronCollapsible} width={16} height={10} />
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

  const leftBorderProps = alertBorder
    ? {
        borderLeftWidth: theme.dimensions.alertBorderWidth,
        borderLeftColor: alertBorder,
      }
    : {}

  const boxProps: BoxProps = {
    ...leftBorderProps,
    borderBottomColor: 'primary',
    borderBottomWidth: theme.dimensions.borderWidth,
  }

  return (
    <Box {...boxProps} {...testIdProps('accordion-wrapper')}>
      <TextArea noBorder={noBorder}>
        {renderHeader()}
        {!expanded && collapsedContent}
        {expanded && expandedContent}
        {children}
      </TextArea>
    </Box>
  )
}

export default AccordionCollapsible

import { Pressable, PressableProps, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, Ref, useState } from 'react'

import { Box, BoxProps, TextArea, VAIcon, VA_ICON_MAP } from './index'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

export type AccordionCollapsibleProps = {
  /** component to display as header of accordion */
  header: ReactNode
  /** component to display only when the accordion is expanded */
  expandedContent: ReactNode
  /** testID for the header */
  testID?: string
  /** a11yHint for the header */
  a11yHint?: string
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
  /** Ref for the header section */
  headerRef?: Ref<View>
}

/**
 * A common component to show content inside of a collapsible accordion.
 */
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
  a11yHint,
  headerRef,
}) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [expanded, setExpanded] = useState(expandedInitialValue || false)

  const onPress = (): void => {
    logAnalyticsEvent(Events.vama_accordion_click(testID || '', !expanded))
    if (customOnPress) {
      customOnPress(!expanded)
    }

    setExpanded(!expanded)
  }

  const pressableProps: PressableProps = {
    onPress,
    accessibilityState: { expanded },
    accessibilityHint: a11yHint || t('viewMoreDetails'),
    accessibilityRole: 'tab',
  }

  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ChevronUp' : 'ChevronDown'

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

    const labelProps = testID
      ? {
          accessibilityLabel: testID,
        }
      : {}

    if (hideArrow) {
      return (
        <Box {...labelProps} accessible={true}>
          {data}
        </Box>
      )
    }

    return (
      <Pressable {...pressableProps} {...labelProps} ref={headerRef}>
        {data}
      </Pressable>
    )
  }

  const boxProps: BoxProps = {
    borderBottomColor: 'primary',
    borderBottomWidth: theme.dimensions.borderWidth,
    accessibilityRole: 'tablist',
  }

  return (
    <Box {...boxProps} {...testIdProps('accordion-wrapper', true)} testID={testID} importantForAccessibility={'no'}>
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

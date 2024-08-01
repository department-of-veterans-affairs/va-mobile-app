import React, { FC, ReactNode, Ref, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps, View } from 'react-native'

import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'

import { Box, BoxProps, TextArea, TextView, VAIcon, VA_ICON_MAP } from './index'

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
  /** show and hide instead of arrow */
  showHideText?: boolean
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
  showHideText,
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
        {!hideArrow && !showHideText && (
          <Box mt={theme.dimensions.condensedMarginBetween}>
            <VAIcon name={iconName} fill={theme.colors.icon.chevronCollapsible} width={16} height={10} />
          </Box>
        )}
        {showHideText && (
          <Box mr={20}>
            <TextView color="footerButton" variant="ActivityFooter">
              {expanded ? t('hide') : t('show')}
            </TextView>
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
    accessibilityRole: 'tablist',
  }

  return (
    <Box {...boxProps} {...testIdProps('accordion-wrapper', true)} testID={testID} importantForAccessibility={'no'}>
      {!showHideText && (
        <TextArea noBorder={noBorder}>
          {renderHeader()}
          {!expanded && collapsedContent}
          {expanded && expandedContent}
          {children}
        </TextArea>
      )}
      {showHideText && (
        <Box>
          {renderHeader()}
          {!expanded && collapsedContent}
          {expanded && expandedContent}
          {children}
        </Box>
      )}
    </Box>
  )
}

export default AccordionCollapsible

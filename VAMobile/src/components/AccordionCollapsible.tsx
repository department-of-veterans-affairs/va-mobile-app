import React, { FC, ReactNode, Ref, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps, View } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, BoxProps, TextArea } from 'components'
import { NAMESPACE } from 'constants/namespaces'
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
 * A common component to show content inside a collapsible accordion.
 */
const AccordionCollapsible: FC<AccordionCollapsibleProps> = ({
  header,
  expandedContent,
  collapsedContent,
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
    if (customOnPress) {
      customOnPress(!expanded)
    }

    setExpanded(!expanded)
  }

  const defaultA11yHint = expanded ? undefined : t('expandToReview')

  const pressableProps: PressableProps = {
    onPress,
    accessibilityState: { expanded },
    accessibilityHint: a11yHint || defaultA11yHint,
    accessibilityRole: 'tab',
  }

  const iconName = expanded ? 'ExpandLess' : 'ExpandMore'

  const renderHeader = () => {
    const data = (
      <Box flexDirection="row">
        <Box flex={1}>{header}</Box>
        <Box alignItems="flex-end">
          <Icon name={iconName} fill={theme.colors.icon.chevronCollapsible} width={30} height={30} />
        </Box>
      </Box>
    )

    const labelProps = testID
      ? {
          accessibilityLabel: testID,
        }
      : {}

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
    <Box {...boxProps} testID={testID} importantForAccessibility={'no'}>
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

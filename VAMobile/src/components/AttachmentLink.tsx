import React, { FC } from 'react'
import { AccessibilityProps, Pressable, PressableProps } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

import Box from './Box'
import LinkWithAnalytics from './LinkWithAnalytics'
import TextView from './TextView'

export type AttachmentLinkProps = {
  /** Name of link/attachment */
  name: string
  /** Size of file attachment and size unit wrapped in parentheses */
  formattedSize?: string
  /** Size of file attachment and size unit wrapped in parentheses with pronounciation */
  formattedSizeA11y?: string
  /** onPress function */
  onPress: () => void
  /** optional a11y Hint */
  a11yHint?: string
  /** optional a11y value */
  a11yValue?: string
}

/**
 * A common component for an attachment link display. Can be used to show file attachments in a message thread.
 */
const AttachmentLink: FC<AttachmentLinkProps> = ({
  name,
  formattedSize,
  formattedSizeA11y,
  onPress,
  a11yHint,
  a11yValue,
}) => {
  const text = [name, formattedSize].join(' ').trim()
  const textA11y = [name, formattedSizeA11y].join(' ').trim()

  const theme = useTheme()
  if (featureEnabled('useOldLinkComponent')) {
    const pressableProps: PressableProps = {
      onPress: onPress,
      accessibilityRole: 'button',
      accessible: true,
    }

    const a11yProps: AccessibilityProps = {
      accessibilityLabel: textA11y,
      ...a11yHintProp(a11yHint || ''),
      accessibilityValue: a11yValue ? { text: a11yValue } : {},
    }

    return (
      <Pressable {...a11yProps} {...pressableProps}>
        <Box flexDirection={'row'} mr={theme.dimensions.gutter}>
          <Box mt={theme.dimensions.attachmentIconTopMargin} mr={theme.dimensions.textIconMargin}>
            <Icon name="AttachFile" width={16} height={16} fill={'link'} />
          </Box>
          <TextView mr={theme.dimensions.textIconMargin} variant={'MobileBodyLink'}>
            {text}
          </TextView>
        </Box>
      </Pressable>
    )
  } else {
    return (
      <LinkWithAnalytics
        type="attachment"
        text={text}
        onPress={onPress}
        a11yLabel={textA11y}
        a11yHint={a11yHint}
        a11yValue={a11yValue}
      />
    )
  }
}
export default AttachmentLink

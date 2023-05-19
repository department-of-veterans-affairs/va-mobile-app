import { AccessibilityProps, Pressable, PressableProps } from 'react-native'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import React, { FC } from 'react'
import TextView from './TextView'
import VAIcon from './VAIcon'

export type AttachmentLinkProps = {
  /** Name of link/attachment */
  name: string
  /** Size of file attachment and size unit wrapped in parentheses */
  formattedSize?: string
  /** Size of file attachment and size unit wrapped in parentheses with pronounciation */
  formattedSizeA11y?: string
  /** onPress function */
  onPress?: () => void
  /** optional a11y Hint */
  a11yHint?: string
  /** optional a11y value */
  a11yValue?: string
}

/**
 * A common component for an attachment link display. Can be used to show file attachments in a message thread.
 */
const AttachmentLink: FC<AttachmentLinkProps> = ({ name, formattedSize, formattedSizeA11y, onPress, a11yHint, a11yValue }) => {
  const theme = useTheme()

  const pressableProps: PressableProps = {
    onPress: onPress,
    accessibilityRole: 'button',
    accessible: true,
  }

  const text = [name, formattedSize].join(' ').trim()
  const textA11y = [name, formattedSizeA11y].join(' ').trim()

  const a11yProps: AccessibilityProps = {
    accessibilityLabel: textA11y,
    ...a11yHintProp(a11yHint || ''),
    accessibilityValue: a11yValue ? { text: a11yValue } : {},
  }

  return (
    <Pressable {...a11yProps} {...pressableProps}>
      <Box flexDirection={'row'} mr={theme.dimensions.gutter}>
        <Box mt={theme.dimensions.attachmentIconTopMargin} mr={theme.dimensions.textIconMargin}>
          <VAIcon name="PaperClip" width={16} height={16} fill={'link'} />
        </Box>
        <TextView mr={theme.dimensions.textIconMargin} variant={'MobileBodyLink'}>
          {text}
        </TextView>
      </Box>
    </Pressable>
  )
}
export default AttachmentLink

import { AccessibilityProps, ActivityIndicator, Pressable, PressableProps } from 'react-native'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
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
  /** onPress function */
  onPress?: () => void
  /** optional a11y Hint */
  a11yHint?: string
  /** optional a11y value */
  a11yValue?: string
  /** Enables loading display */
  load?: boolean
}

const AttachmentLink: FC<AttachmentLinkProps> = ({ name, formattedSize, onPress, a11yHint, a11yValue, load }) => {
  const theme = useTheme()

  const pressableProps: PressableProps = {
    onPress: onPress,
    accessibilityRole: 'button',
    accessible: true,
  }

  const text = [name, formattedSize].join(' ').trim()
  const testId = generateTestID(text, '')

  const a11yProps: AccessibilityProps = {
    ...testIdProps(testId || ''),
    ...a11yHintProp(a11yHint || ''),
    accessibilityValue: a11yValue ? { text: a11yValue } : {},
  }

  return (
    <Pressable {...a11yProps} {...pressableProps}>
      <Box flexDirection={'row'} mr={theme.dimensions.gutter}>
        <Box mt={theme.dimensions.alertBorderWidth} mr={theme.dimensions.textIconMargin}>
          <VAIcon name="PaperClip" width={16} height={16} fill={'link'} />
        </Box>
        <TextView mr={theme.dimensions.textIconMargin} variant={'MobileBodyLink'} color={'link'} accessible={true}>
          {text}
        </TextView>
        {load && <ActivityIndicator accessible={true} size="small" color={theme.colors.icon.spinner} />}
      </Box>
    </Pressable>
  )
}
export default AttachmentLink

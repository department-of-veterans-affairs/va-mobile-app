import { Pressable, PressableProps } from 'react-native'
import { generateTestID } from '../utils/common'
import { testIdProps } from '../utils/accessibility'
import { useTheme } from '../utils/hooks'
import Box from './Box'
import React, { FC } from 'react'
import TextView from './TextView'
import VAIcon from './VAIcon'

export type AttachmentLinkProps = {
  /** Name of link/attachment */
  name: string
  /** Size of file attachment */
  size?: number
  /** File size unit: KB, GB, etc. */
  sizeUnit?: string
  /** onPress function */
  onPress?: () => void
  /** a11y Hint */
  a11yHint?: string
}

const AttachmentLink: FC<AttachmentLinkProps> = ({ name, size, sizeUnit, onPress, a11yHint }) => {
  const theme = useTheme()

  const pressableProps: PressableProps = {
    onPress,
    accessibilityRole: 'button',
    accessible: true,
    accessibilityHint: a11yHint || '',
  }
  const formattedSize = size && sizeUnit ? `(${size} ${sizeUnit})` : ''
  const text = [name, formattedSize].join(' ').trim()
  const testId = generateTestID(text, '')

  return (
    <Pressable {...testIdProps(testId)} {...pressableProps}>
      <Box flexDirection={'row'}>
        <Box mt={theme.dimensions.alertBorderWidth} mr={theme.dimensions.textIconMargin}>
          <VAIcon name="PaperClip" width={16} height={16} fill={'link'} />
        </Box>
        <TextView variant={'MobileBodyLink'} color={'link'} accessible={true}>
          {text}
        </TextView>
      </Box>
    </Pressable>
  )
}
export default AttachmentLink

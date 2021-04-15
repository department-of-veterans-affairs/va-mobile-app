import { ActivityIndicator, Pressable, PressableProps } from 'react-native'
import { SecureMessagingState, StoreState } from '../store'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks'
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
  /** Attachment id to determine which attachment the loading indicator appears next to if message state is currently loading a file */
  loadKey?: string
}

const AttachmentLink: FC<AttachmentLinkProps> = ({ name, size, sizeUnit, onPress, a11yHint, loadKey }) => {
  const theme = useTheme()
  const { loadingFile, loadingFileKey } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const pressableProps: PressableProps = {
    onPress: onPress,
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
        <TextView mr={theme.dimensions.textIconMargin} variant={'MobileBodyLink'} color={'link'} accessible={true}>
          {text}
        </TextView>
        {loadingFile && loadKey == loadingFileKey && <ActivityIndicator accessible={true} size="small" color={theme.colors.icon.spinner} />}
      </Box>
    </Pressable>
  )
}
export default AttachmentLink

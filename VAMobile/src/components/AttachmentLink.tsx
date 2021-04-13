import { NAMESPACE } from '../constants/namespaces'
import { Pressable, PressableProps } from 'react-native'
import { SecureMessagingAttachment } from '../store/api'
import { generateTestID } from '../utils/common'
import { testIdProps } from '../utils/accessibility'
import { useTheme, useTranslation } from '../utils/hooks'
import Box from './Box'
import React, { FC } from 'react'
import TextView from './TextView'
import VAIcon from './VAIcon'

export type AttachmentLinkProps = {
  /** File size */
  size: number
  /** File size unit: KB, GB, etc. */
  sizeUnit: string
  /** File attachment */
  attachment: SecureMessagingAttachment
}

const AttachmentLink: FC<AttachmentLinkProps> = ({ size, sizeUnit, attachment }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)

  const pressableProps: PressableProps = {
    accessibilityRole: 'button',
    accessible: true,
    accessibilityHint: t('secureMessaging.viewAttachment.a11yHint'),
  }

  /** SecureMessagingAttachment does not currently have size attribute */
  const fileName = attachment.filename
  const fileSize = size
  //const fileLink = attachment.link -- will use link for file viewing onPress in a later ticket

  const text = `${fileName} (${fileSize} ${sizeUnit})`
  const testId = generateTestID(text, '')

  return (
    <Pressable {...pressableProps} {...testIdProps(testId)}>
      <Box flexDirection={'row'}>
        <Box mt={theme.dimensions.textIconMargin} mr={theme.dimensions.textIconMargin}>
          <VAIcon name="PaperClip" width={20} height={20} fill={'link'} />
        </Box>
        <TextView variant={'MobileBodyLink'} color={'link'} accessible={true}>
          {text}
        </TextView>
      </Box>
    </Pressable>
  )
}
export default AttachmentLink

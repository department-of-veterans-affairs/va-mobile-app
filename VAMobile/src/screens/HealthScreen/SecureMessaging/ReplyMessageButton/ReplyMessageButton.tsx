import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, VAButton, VAButtonProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export type ReplyMessageButtonProps = {
  messageID: number
}

const ReplyMessageButton: FC<ReplyMessageButtonProps> = ({ messageID }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const onPress = navigateTo('ReplyMessage', { messageID: messageID, attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  const replyButtonProps: VAButtonProps = {
    label: t('reply'),
    buttonType: ButtonTypesConstants.buttonPrimary,
    onPress: onPress,
    iconProps: { name: 'Reply', fill: 'navBar' },
    testID: 'replyTestID',
  }

  return (
    <Box mx={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding}>
      <VAButton {...replyButtonProps} />
    </Box>
  )
}

export default ReplyMessageButton

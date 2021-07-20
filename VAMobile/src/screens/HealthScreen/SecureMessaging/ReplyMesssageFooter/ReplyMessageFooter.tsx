import React, { FC } from 'react'

import { ComposeTypeConstants } from 'constants/secureMessaging'
import { FooterButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTranslation } from 'utils/hooks'

export type ReplyMessageFooterProps = {
  messageID: number
}

const ReplyMessageFooter: FC<ReplyMessageFooterProps> = ({ messageID }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  const onPress = navigateTo('ComposeMessage', { composeType: ComposeTypeConstants.reply, messageID, attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  return (
    <FooterButton
      onPress={onPress}
      text={t('secureMessaging.reply')}
      iconProps={{ name: 'Reply' }}
      a11yHint={t('secureMessaging.reply.a11yHint')}
      testID={t('secureMessaging.reply.testID')}
    />
  )
}

export default ReplyMessageFooter

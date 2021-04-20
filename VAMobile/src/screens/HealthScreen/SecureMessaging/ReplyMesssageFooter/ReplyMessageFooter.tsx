import React, { FC } from 'react'

import { FooterButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTranslation } from 'utils/hooks'

const ReplyMessageFooter: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  const onPress = navigateTo('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })

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

import React, { FC } from 'react'

import { FooterButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTranslation } from 'utils/hooks'

const ComposeMessageFooter: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  const onPress = navigateTo('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  return (
    <FooterButton
      onPress={onPress}
      text={t('secureMessaging.composeMessage')}
      iconProps={{ name: 'Compose' }}
      a11yHint={t('secureMessaging.composeMessage.a11yHint')}
      testID={t('secureMessaging.composeMessage')}
    />
  )
}

export default ComposeMessageFooter

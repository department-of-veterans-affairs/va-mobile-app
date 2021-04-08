import React, { FC } from 'react'

import { FooterButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTranslation } from 'utils/hooks'

const ComposeMessageFooter: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  const onPress = navigateTo('ComposeMessage')

  return <FooterButton onPress={onPress} text={t('secureMessaging.composeMessage')} iconProps={{ name: 'Compose' }} a11yHint={t('secureMessaging.composeMessage.a11yHint')} />
}

export default ComposeMessageFooter

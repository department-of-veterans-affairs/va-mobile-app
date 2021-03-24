/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, LoadingComponent, TextView } from 'components'
import { renderMessages } from 'utils/secureMessaging'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type InboxProps = Record<string, unknown>

const Inbox: FC<InboxProps> = () => {
  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { inboxMessages, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const onInboxMessagePress = (messageID: number): void => {
    navigateTo('ViewMessageScreen', { messageID })()
  }

  if (loading) {
    return <LoadingComponent />
  }

  if (!inboxMessages?.length) {
    // TODO What is empty inbox view?
    //return <NoMessages />
  }

  return (
    <Box {...testIdProps('Inbox-page')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.inbox'))} accessible={true}>
        <TextView variant="MobileBodyBold">{t('secureMessaging.inbox')}</TextView>
      </Box>
      {renderMessages(inboxMessages || [], t, onInboxMessagePress)}
    </Box>
  )
}

export default Inbox

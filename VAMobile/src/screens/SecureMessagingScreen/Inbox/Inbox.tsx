import { TFunction } from 'i18next'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'

import _ from 'underscore'
import moment from 'moment'

import { Box, List, ListItemObj, LoadingComponent, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingMessageList } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { VATheme } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
//import NoMessages from '../NoMessages/NoMessages'

const getListItemsForMessages = (listOfMessages: SecureMessagingMessageList, t: TFunction, onMessagePress: (messageID: number) => void): Array<ListItemObj> => {
  const listItems: Array<ListItemObj> = []

  _.forEach(listOfMessages, (message) => {
    const { attributes } = message
    const { senderName, subject, sentDate, readReceipt } = attributes
    const formattedDate = moment(sentDate)

    const unreadIndicator = readReceipt === 'READ' ? '' : '* '
    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: `${unreadIndicator}${senderName}` }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: subject }) },
      { text: t('common:text.raw', { text: `${formattedDate.format('DD MMM @ HHmm zz')}` }) },
    ]

    listItems.push({ textLines, onPress: () => onMessagePress(message.id), a11yHintText: t('secureMessaging.viewMessage.a11yHint') })
  })

  return listItems
}

export const getMessages = (messages: SecureMessagingMessageList, theme: VATheme, t: TFunction, onMessagePress: (messageID: number) => void, isReverseSort: boolean): ReactNode => {
  console.debug('isReverseSort', isReverseSort)
  if (!messages) {
    return <></>
  }

  const listOfMessages = messages
  const listItems = getListItemsForMessages(listOfMessages, t, onMessagePress)

  return <List items={listItems} />
}

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

  if (_.isEmpty(inboxMessages)) {
    // TODO What is empty inbox view?
    //return <NoMessages />
  }

  return (
    <Box {...testIdProps('Inbox-page')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.inbox'))} accessible={true}>
        <TextView variant="MobileBodyBold">{t('secureMessaging.inbox')}</TextView>
      </Box>
      {getMessages(inboxMessages || [], theme, t, onInboxMessagePress, false)}
    </Box>
  )
}

export default Inbox

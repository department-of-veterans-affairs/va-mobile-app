import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import { Box, LoadingComponent, TextView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingMessageAttributes, SecureMessagingMessageMap } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { getMessage, getThread } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import CollapsibleMessage from './CollapsibleMessage'
import ReplyMessageFooter from '../ReplyMesssageFooter/ReplyMessageFooter'

type ViewMessageScreenProps = StackScreenProps<HealthStackParamList, 'ViewMessageScreen'>

/**
 * Accepts a message, map of all messages, and array of messageIds in the current thread.  Gets each messageId from the message map, sorts by
 * sentDate ascending, and returns an array of <CollapsibleMessages/>
 */
export const renderMessages = (message: SecureMessagingMessageAttributes, messagesById: SecureMessagingMessageMap, thread: Array<number>): ReactNode => {
  const threadMessages = thread.map((messageID) => messagesById[messageID]).sort((message1, message2) => (message1.sentDate < message2.sentDate ? -1 : 1))

  return threadMessages.map((m) => m && m.messageId && <CollapsibleMessage key={m.messageId} message={m} isInitialMessage={m.messageId === message.messageId} />)
}

const ViewMessageScreen: FC<ViewMessageScreenProps> = ({ route }) => {
  const messageID = Number(route.params.messageID)

  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { messagesById, threads, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const message = messagesById?.[messageID]
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))

  useEffect(() => {
    dispatch(getMessage(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))
    dispatch(getThread(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))
  }, [messageID, dispatch])

  if (loading) {
    return <LoadingComponent text={t('secureMessaging.viewMessage.loading')} />
  }

  if (!message || !messagesById || !thread) {
    // return empty /error  state
    return <></>
  }

  return (
    <>
      <ScrollView {...testIdProps('ViewMessage-page')}>
        <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
          <Box borderColor={'primary'} borderBottomWidth={'default'} p={theme.dimensions.cardPadding}>
            <TextView variant="BitterBoldHeading" accessibilityRole={'header'}>
              {t('secureMessaging.viewMessage.subject', { subject: message.subject })}
            </TextView>
          </Box>
          {renderMessages(message, messagesById, thread)}
        </Box>
      </ScrollView>
      <ReplyMessageFooter messageID={messageID} />
    </>
  )
}

export default ViewMessageScreen

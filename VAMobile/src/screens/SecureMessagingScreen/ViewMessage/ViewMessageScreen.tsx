import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import { Box, LoadingComponent, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingMessageAttributes, SecureMessagingMessageMap } from 'store/api/types'
import { SecureMessagingStackParamList } from '../SecureMessagingStackScreens'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { getMessage, getThread } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import CollapsibleMessage from './CollapsibleMessage'

type ViewMessageScreenProps = StackScreenProps<SecureMessagingStackParamList, 'ViewMessageScreen'>

export const renderMessages = (message: SecureMessagingMessageAttributes, messagesById: SecureMessagingMessageMap, thread: Array<number>): ReactNode => {
  const threadMessages = thread.map((messageID) => messagesById[messageID]).sort((message1, message2) => (message1.sentDate < message2.sentDate ? -1 : 1))
  if (!threadMessages) {
    return <></>
  }

  return threadMessages.map((m) => <CollapsibleMessage key={m.messageId} message={m} isInitialMessage={m.messageId === message.messageId} />)
}

const ViewMessageScreen: FC<ViewMessageScreenProps> = ({ route }) => {
  const messageID = Number(route.params.messageID)

  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
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
    return <LoadingComponent />
  }

  if (!message || !messagesById || !thread) {
    // return empty /error  state
    return <></>
  }

  return (
    <ScrollView {...testIdProps('ViewMessage-page')}>
      <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="BitterBoldHeading">{`${t('secureMessaging.viewMessage.subject')}: ${message.subject}`}</TextView>
        </TextArea>
        {renderMessages(message, messagesById, thread)}
      </Box>
    </ScrollView>
  )
}

export default ViewMessageScreen

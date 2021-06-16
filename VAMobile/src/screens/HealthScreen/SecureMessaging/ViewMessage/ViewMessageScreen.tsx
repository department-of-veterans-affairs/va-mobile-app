import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import { AlertBox, Box, ErrorComponent, LoadingComponent, TextView, VAButton, VAScrollView } from 'components'
import { DateTime } from 'luxon'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { REPLY_WINDOW_IN_DAYS } from 'constants/secureMessaging'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingMessageAttributes, SecureMessagingMessageMap } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { formatSubject } from 'utils/secureMessaging'
import { getMessage, getThread } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
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
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { messagesById, threads, loading, messageIDsOfError } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const message = messagesById?.[messageID]
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))
  const subject = message ? message.subject : ''
  const category = message ? message.category : 'OTHER'

  useEffect(() => {
    dispatch(getMessage(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))
    dispatch(getThread(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))
  }, [messageID, dispatch])

  // If error is caused by an individual message, we want the error alert to be contained to that message, not to take over the entire screen
  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID) && !messageIDsOfError) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID} />
  }

  if (loading) {
    return <LoadingComponent text={t('secureMessaging.viewMessage.loading')} />
  }

  if (!message || !messagesById || !thread) {
    // return empty /error  state
    // do not replace with error component otherwise user will always see a red error flash right before their message loads
    return <></>
  }

  const replyExpired = DateTime.fromISO(message.sentDate).diffNow('days').days < REPLY_WINDOW_IN_DAYS

  const onPressCompose = navigateTo('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  return (
    <>
      <VAScrollView {...testIdProps('ViewMessage-page')}>
        <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
          <Box borderColor={'primary'} borderBottomWidth={'default'} p={theme.dimensions.cardPadding}>
            <TextView variant="BitterBoldHeading" accessibilityRole={'header'}>
              {formatSubject(category, subject, t)}
            </TextView>
          </Box>
          {renderMessages(message, messagesById, thread)}
        </Box>
        {replyExpired && (
          <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
            <AlertBox background={'noCardBackground'} border={'warning'} title={t('secureMessaging.reply.youCanNoLonger')} text={t('secureMessaging.reply.olderThan45Days')}>
              <Box mt={theme.dimensions.standardMarginBetween}>
                <VAButton label={t('secureMessaging.composeMessage.new')} onPress={onPressCompose} buttonType={'buttonPrimary'} />
              </Box>
            </AlertBox>
          </Box>
        )}
      </VAScrollView>
      {!replyExpired && <ReplyMessageFooter messageID={messageID} />}
    </>
  )
}

export default ViewMessageScreen

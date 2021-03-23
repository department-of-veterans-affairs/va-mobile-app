import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import _ from 'underscore'
import moment from 'moment'

import { Box, List, ListItemObj, LoadingComponent, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingMessageList } from 'store/api/types'
import { SecureMessagingStackParamList } from '../SecureMessagingStackScreens'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { VATheme } from 'styles/theme'
import { listFolderMessages } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

const getListItemsForMessages = (listOfMessages: SecureMessagingMessageList, t: TFunction, onMessagePress: (messageID: number) => void, folderName: string): Array<ListItemObj> => {
  const listItems: Array<ListItemObj> = []

  _.forEach(listOfMessages, (message) => {
    const { attributes } = message
    const { recipientName, senderName, subject, sentDate } = attributes
    const formattedDate = moment(sentDate)

    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: folderName === 'Sent' ? recipientName : senderName }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: subject }) },
      { text: t('common:text.raw', { text: `${formattedDate.format('DD MMM @ HHmm zz')}` }) },
    ]

    listItems.push({ textLines, onPress: () => onMessagePress(message.id), a11yHintText: t('secureMessaging.viewMessage.a11yHint') })
  })

  return listItems
}

export const getMessages = (
  messages: SecureMessagingMessageList,
  theme: VATheme,
  t: TFunction,
  onMessagePress: (messageID: number) => void,
  // isReverseSort: boolean,
  folderName: string,
): ReactNode => {
  if (!messages) {
    return <></>
  }

  const listItems = getListItemsForMessages(messages, t, onMessagePress, folderName)

  return <List items={listItems} />
}

type FolderMessagesScreenProps = StackScreenProps<SecureMessagingStackParamList, 'FolderMessagesScreen'>

const FolderMessagesScreen: FC<FolderMessagesScreenProps> = ({ route }) => {
  const { folderID, folderName } = route.params

  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { messagesByFolderId, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  useEffect(() => {
    dispatch(listFolderMessages(folderID, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
  }, [dispatch, folderID])

  const onMessagePress = (messageID: number): void => {
    navigateTo('ViewMessageScreen', { messageID })()
  }

  if (loading) {
    return <LoadingComponent />
  }

  const folderMessages = messagesByFolderId ? messagesByFolderId.folderID : { data: [], links: {}, meta: {} }
  const messages = folderMessages ? folderMessages.data : []
  if (_.isEmpty(folderMessages)) {
    // TODO What is empty folder view?
    //return <NoMessages />
  }

  return (
    <Box {...testIdProps('FolderMessages-page')}>
      {
        <Box m={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.inbox'))} accessible={true}>
          <TextView variant="MobileBodyBold">{folderName}</TextView>
        </Box>
      }
      {getMessages(messages, theme, t, onMessagePress, folderName)}
    </Box>
  )
}

export default FolderMessagesScreen

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import _ from 'underscore'
import moment from 'moment'

import { Box, List, ListItemObj, LoadingComponent, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagesList } from 'store/api/types'
import { SecureMessagingStackParamList } from '../SecureMessagingStackScreens'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { VATheme } from 'styles/theme'
import { listFolderMessages } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
//import NoMessages from '../NoMessages/NoMessages'

const getListItemsForMessages = (listOfMessages: SecureMessagesList, t: TFunction, onMessagePress: (messageID: string) => void): Array<ListItemObj> => {
  const listItems: Array<ListItemObj> = []

  _.forEach(listOfMessages, (message) => {
    const { attributes } = message
    const { senderName, subject, sentDate } = attributes
    const formattedDate = moment(sentDate)

    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: senderName }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: subject }) },
      { text: t('common:text.raw', { text: `${formattedDate.format('DD MMM @ HHmm zz')}` }) },
    ]

    listItems.push({ textLines, onPress: () => onMessagePress(message.id), a11yHintText: t('secure_messaging.viewDetails') })
  })

  return listItems
}

export const getMessages = (messages: SecureMessagesList, theme: VATheme, t: TFunction, onMessagePress: (messageID: string) => void, isReverseSort: boolean): ReactNode => {
  if (!messages) {
    return <></>
  }

  const listItems = getListItemsForMessages(messages, t, onMessagePress)

  return <List items={listItems} />
}

type FolderMessagesScreenProps = StackScreenProps<SecureMessagingStackParamList, 'FolderMessages'>

const FolderMessagesScreen: FC<FolderMessagesScreenProps> = ({ route }) => {
  const { folderID, folderName } = route.params

  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { messagesByFolderId, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  console.log('Listing folder messages', folderID)
  useEffect(() => {
    dispatch(listFolderMessages(folderID))
  }, [dispatch, folderID])

  const onMessagePress = (messageID: string): void => {
    navigateTo('MessageThread', { messageID })()
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
      {getMessages(messages, theme, t, onMessagePress, false)}
    </Box>
  )
}

export default FolderMessagesScreen

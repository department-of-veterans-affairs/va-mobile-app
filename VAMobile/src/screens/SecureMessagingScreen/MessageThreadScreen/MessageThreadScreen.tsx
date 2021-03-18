import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import moment from 'moment'

import { Box, List, ListItemObj, LoadingComponent, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagesList, SecureMessagesListData } from 'store/api/types'
import { SecureMessagingStackParamList } from '../SecureMessagingStackScreens'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { listFolderMessages } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type MessageThreadScreenProps = StackScreenProps<SecureMessagingStackParamList, 'MessageThreadScreen'>

const MessageThreadScreen: FC<MessageThreadScreenProps> = ({ navigation, route }) => {
  const { folderID, folderName } = route.params

  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  console.log('Listing folder messages', folderID)
  useEffect(() => {
    // dispatch(listFolderMessages(folderID))
  }, [dispatch, folderID])

  if (loading) {
    return <LoadingComponent />
  }

  return <Box {...testIdProps('FolderMessages-page')} />
}

export default MessageThreadScreen

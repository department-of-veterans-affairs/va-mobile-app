import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { DefaultList, LoadingComponent, VAScrollView } from 'components'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { useRouteNavigation, useTranslation } from 'utils/hooks'

import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { getMessagesListItems } from 'utils/secureMessaging'
import { listFolderMessages } from 'store/actions'
import { testIdProps } from 'utils/accessibility'

type FolderMessagesProps = StackScreenProps<HealthStackParamList, 'FolderMessages'>

const FolderMessages: FC<FolderMessagesProps> = ({ route }) => {
  const { folderID, folderName } = route.params

  const t = useTranslation(NAMESPACE.HEALTH)
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

  if (messages.length === 0) {
    return <NoFolderMessages folderName={folderName} />
  }

  return (
    <>
      <VAScrollView {...testIdProps('', false, 'FolderMessages-page')}>
        <DefaultList items={getMessagesListItems(messages, t, onMessagePress, folderName)} title={folderName} />
      </VAScrollView>
      <ComposeMessageFooter />
    </>
  )
}

export default FolderMessages

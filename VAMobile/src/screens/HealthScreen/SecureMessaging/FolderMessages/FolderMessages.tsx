import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, LoadingComponent, TextView, VAScrollView } from 'components'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { listFolderMessages } from 'store/actions'
import { renderMessages } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import ComposeMessageFooter from '../ComposeMessageFooter/ComposeMessageFooter'

type FolderMessagesProps = StackScreenProps<HealthStackParamList, 'FolderMessages'>

const FolderMessages: FC<FolderMessagesProps> = ({ route }) => {
  const { folderID, folderName } = route.params

  const t = useTranslation(NAMESPACE.HEALTH)
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

  if (!messages?.length) {
    // TODO What is empty folder view?
    //return <NoMessages />
  }

  return (
    <>
      <VAScrollView {...testIdProps('FolderMessages-page')}>
        {
          <Box m={theme.dimensions.gutter} {...testIdProps(folderName)} accessible={true}>
            <TextView variant="MobileBodyBold">{folderName}</TextView>
          </Box>
        }
        {renderMessages(messages, t, onMessagePress, folderName)}
      </VAScrollView>
      <ComposeMessageFooter />
    </>
  )
}

export default FolderMessages

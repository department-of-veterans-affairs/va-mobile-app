import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import FolderMessagesScreen from './FolderMessagesScreen/FolderMessagesScreen'
import ViewMessageScreen from './ViewMessage/ViewMessageScreen'

export type SecureMessagingStackParamList = {
  SecureMessaging: undefined
  Inbox: {
    messageID: number
  }
  Folders: {
    folderID: number
  }
  FolderMessagesScreen: {
    folderID: number
    folderName: string
  }
  ViewMessageScreen: {
    messageID: number
  }
}

const SecureMessagingStack = createStackNavigator<SecureMessagingStackParamList>()

export const getSecureMessagingScreens = (t: TFunction): Array<ReactNode> => {
  return [
    //TODO add next level of nav
    // <SecureMessagingStack.Screen
    //   key={'InboxMessages'}
    //   name="InboxMessages"
    //   component={InboxMessages}
    //   options={{ title: t('secure_messaging.inbox_messages') }}
    // />,
    <SecureMessagingStack.Screen key={'FolderMessages'} name="FolderMessagesScreen" component={FolderMessagesScreen} options={{ title: t('secureMessaging.folders') }} />,
    <SecureMessagingStack.Screen key={'ViewMessage'} name="ViewMessageScreen" component={ViewMessageScreen} options={{ title: t('secureMessaging.viewMessage') }} />,
  ]
}

import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import FolderMessagesScreen from './FolderMessagesScreen/FolderMessagesScreen'
import MessageThreadScreen from './MessageThreadScreen/MessageThreadScreen'

export type SecureMessagingStackParamList = {
  SecureMessaging: undefined
  Inbox: {
    messageID: string
  }
  Folders: {
    folderID: string
  }
  FolderMessagesScreen: {
    folderID: string
    folderName: string
  }
  MessageThreadScreen: {
    messageID: string
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
    <SecureMessagingStack.Screen key={'FolderMessages'} name="FolderMessagesScreen" component={FolderMessagesScreen} />,
    <SecureMessagingStack.Screen key={'MessageThread'} name="MessageThreadScreen" component={MessageThreadScreen} options={{ title: t('secureMessaging.viewMessage') }} />,
  ]
}

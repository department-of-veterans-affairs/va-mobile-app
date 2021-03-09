import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

// import FolderDetails from './Folders/FolderDetails'
// import InboxMessages from './Inbox/InboxMessages'

export type SecureMessagingStackParamList = {
  SecureMessaging: undefined
  Inbox: {
    messageID: string
  }
  Folders: {
    folderID: string
  }
}

const SecureMessagingStack = createStackNavigator<SecureMessagingStackParamList>()

export const getSecureMessagingScreens = (t: TFunction): Array<ReactNode> => {
  return [
    // TODO add next level of nav
    // <SecureMessagingStack.Screen
    //   key={'InboxMessages'}
    //   name="InboxMessages"
    //   component={InboxMessages}
    //   options={{ title: t('secure_messaging.inbox_messages') }}
    // />,
    // <SecureMessagingStack.Screen
    //   key={'FolderDetails'}
    //   name="FolderDetails"
    //   component={FolderDetails}
    //   options={{ title: t('secureMessaging.folder_details.title') }}
    // />,
  ]
}

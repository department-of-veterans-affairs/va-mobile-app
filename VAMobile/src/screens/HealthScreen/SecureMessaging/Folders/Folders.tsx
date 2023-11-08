import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'

import { Box, LoadingComponent, SimpleList, SimpleListItemObj, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { FolderNameTypeConstants, HIDDEN_FOLDERS, TRASH_FOLDER_NAME } from 'constants/secureMessaging'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { SecureMessagingFolderList, SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { SecureMessagingState } from 'store/slices'
import { VATheme } from 'styles/theme'
import { logAnalyticsEvent } from 'utils/analytics'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

const getListItemsForFolders = (
  listOfFolders: SecureMessagingFolderList,
  t: TFunction,
  onFolderPress: (folderID: number, folderName: string) => void,
): Array<SimpleListItemObj> => {
  const listItems: Array<SimpleListItemObj> = []

  // Filter out hidden folders
  const visibleFolders = listOfFolders.filter((folder) => !HIDDEN_FOLDERS.has(folder.attributes.name))

  _.forEach(visibleFolders, (folder, index) => {
    const { attributes } = folder
    const {
      name,
      folderId,
      count,
      // unreadCount
    } = attributes
    const draftDisplay = folder.attributes.name === FolderNameTypeConstants.drafts && count > 0
    const nameOfFolder = name === FolderNameTypeConstants.deleted ? TRASH_FOLDER_NAME : name
    listItems.push({
      text: `${t('text.raw', { text: nameOfFolder })}${draftDisplay ? ` (${count})` : ''}`,
      onPress: () => onFolderPress(folderId, nameOfFolder),
      a11yHintText: draftDisplay ? t('secureMessaging.folders.count.a11yHint', { count, folderName: nameOfFolder }) : undefined,
      a11yValue: t('listPosition', { position: index + 1, total: visibleFolders.length }),
      testId: t('text.raw', { text: nameOfFolder }),
    })
  })

  return listItems
}

export const getSystemFolders = (
  folders: SecureMessagingFolderList,
  theme: VATheme,
  t: TFunction,
  onFolderPress: (folderID: number, folderName: string) => void,
  // isReverseSort: boolean,
): ReactNode => {
  if (!folders) {
    return <></>
  }

  const systemFolders = _.filter(folders, (folder) => {
    return folder.attributes.systemFolder
  })
  const listItems = getListItemsForFolders(systemFolders, t, onFolderPress)

  return <SimpleList items={listItems} title={t('secureMessaging.folders')} />
}

export const getUserFolders = (
  folders: SecureMessagingFolderList,
  theme: VATheme,
  t: TFunction,
  onFolderPress: (folderID: number, folderName: string) => void,
  // isReverseSort: boolean,
): ReactNode => {
  if (!folders) {
    return <></>
  }

  const userFolders = _.filter(folders, (folder) => {
    return !folder.attributes.systemFolder
  })

  if (!userFolders.length) {
    return <></>
  }

  // sort alphabetically
  userFolders.sort((a, b) => a.attributes.name.toLowerCase().localeCompare(b.attributes.name.toLowerCase()))

  const listItems = getListItemsForFolders(userFolders, t, onFolderPress)

  return <SimpleList items={listItems} title={t('secureMessaging.myFolders')} />
}

type FoldersProps = Record<string, unknown>

const Folders: FC<FoldersProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { folders, loadingFolders } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)

  const onFolderPress = (folderID: number, folderName: string): void => {
    const folder = (): string => {
      switch (folderID) {
        case SecureMessagingSystemFolderIdConstants.SENT:
          return 'sent'
        case SecureMessagingSystemFolderIdConstants.INBOX:
          return 'inbox'
        case SecureMessagingSystemFolderIdConstants.DELETED:
          return 'deleted'
        case SecureMessagingSystemFolderIdConstants.DRAFTS:
          return 'drafts'
        default:
          return 'custom'
      }
    }
    logAnalyticsEvent(Events.vama_sm_folder_open(folder()))
    navigateTo('FolderMessages', { folderID, folderName })()
  }

  if (loadingFolders) {
    return <LoadingComponent text={t('secureMessaging.folders.loading')} />
  }

  return (
    <VAScrollView {...testIdProps('', false, 'Folders-page')}>
      <Box>
        {getSystemFolders(folders || [], theme, t, onFolderPress)}
        {getUserFolders(folders || [], theme, t, onFolderPress)}
      </Box>
    </VAScrollView>
  )
}

export default Folders

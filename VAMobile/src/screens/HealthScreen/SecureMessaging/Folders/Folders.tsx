import React from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'
import _ from 'underscore'

import { useFolders } from 'api/secureMessaging'
import { SecureMessagingFolderList, SecureMessagingSystemFolderIdConstants } from 'api/types'
import { Box, LoadingComponent, SimpleList, SimpleListItemObj, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, HIDDEN_FOLDERS, TRASH_FOLDER_NAME } from 'constants/secureMessaging'
import { VATheme } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

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
      a11yHintText: draftDisplay
        ? t('secureMessaging.folders.count.a11yHint', { count, folderName: nameOfFolder })
        : undefined,
      a11yValue: t('listPosition', { position: index + 1, total: visibleFolders.length }),
      testId: t('text.raw', { text: nameOfFolder }),
    })
  })

  return listItems
}

export function getSystemFolders(
  folders: SecureMessagingFolderList,
  theme: VATheme,
  t: TFunction,
  onFolderPress: (folderID: number, folderName: string) => void,
  // isReverseSort: boolean,
) {
  if (!folders) {
    return <></>
  }

  const systemFolders = _.filter(folders, (folder) => {
    return folder.attributes.systemFolder
  })
  const listItems = getListItemsForFolders(systemFolders, t, onFolderPress)

  return <SimpleList items={listItems} title={t('secureMessaging.folders')} />
}

export function getUserFolders(
  folders: SecureMessagingFolderList,
  theme: VATheme,
  t: TFunction,
  onFolderPress: (folderID: number, folderName: string) => void,
  // isReverseSort: boolean,
) {
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

function Folders({}: FoldersProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { data: foldersData, isLoading: loadingFolders } = useFolders()
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
    navigateTo('FolderMessages', { folderID, folderName })
  }

  if (loadingFolders) {
    return <LoadingComponent text={t('secureMessaging.folders.loading')} />
  }

  return (
    <VAScrollView {...testIdProps('', false, 'Folders-page')}>
      <Box>
        {getSystemFolders(foldersData?.data || [], theme, t, onFolderPress)}
        {getUserFolders(foldersData?.data || [], theme, t, onFolderPress)}
      </Box>
    </VAScrollView>
  )
}

export default Folders

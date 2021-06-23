import { TFunction } from 'i18next'
import { useSelector } from 'react-redux'

import React, { FC, ReactNode } from 'react'

import _ from 'underscore'

import { Box, LoadingComponent, SimpleList, SimpleListItemObj } from 'components'
import { DELETED, DRAFTS, HIDDEN_FOLDERS } from 'constants/secureMessaging'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingFolderList } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { VATheme } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

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
      // count,
      // unreadCount
    } = attributes

    listItems.push({
      text: t('common:text.raw', { text: name }),
      onPress: () => onFolderPress(folderId, name),
      a11yHintText: t('secureMessaging.viewMessage.a11yHint'),
      a11yValue: t('common:listPosition', { position: index + 1, total: visibleFolders.length }),
      testId: t('common:text.raw', { text: name }),
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
    return folder.attributes.systemFolder && folder.attributes.name !== DRAFTS && folder.attributes.name !== DELETED
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
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { folders, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const onFolderPress = (folderID: number, folderName: string): void => {
    navigateTo('FolderMessages', { folderID, folderName })()
  }

  if (loading) {
    return <LoadingComponent text={t('secureMessaging.folders.loading')} />
  }

  return (
    <Box {...testIdProps('', false, 'Folders-page')}>
      {getSystemFolders(folders || [], theme, t, onFolderPress)}
      {getUserFolders(folders || [], theme, t, onFolderPress)}
    </Box>
  )
}

export default Folders

import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'

import React, { FC, ReactNode, useEffect } from 'react'

import _ from 'underscore'

import { Box, List, ListItemObj, LoadingComponent, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingFolderList } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { VATheme } from 'styles/theme'
import { listFolders } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

const getListItemsForFolders = (listOfFolders: SecureMessagingFolderList, t: TFunction, onFolderPress: (folderID: string) => void): Array<ListItemObj> => {
  const listItems: Array<ListItemObj> = []

  _.forEach(listOfFolders, (folder) => {
    const { attributes } = folder
    const { name, count, unreadCount } = attributes

    const textLines: Array<TextLine> = [{ text: t('common:text.raw', { text: name }) }]

    listItems.push({ textLines, onPress: () => onFolderPress(folder.id), a11yHintText: t('secure_messaging.viewDetails') })
  })

  return listItems
}

export const getFolders = (folders: SecureMessagingFolderList, theme: VATheme, t: TFunction, onFolderPress: (folderID: string) => void, isReverseSort: boolean): ReactNode => {
  if (!folders) {
    return <></>
  }

  const listOfFolders = folders
  const listItems = getListItemsForFolders(listOfFolders, t, onFolderPress)

  return <List items={listItems} />
}

export const getSystemFolders = (
  folders: SecureMessagingFolderList,
  theme: VATheme,
  t: TFunction,
  onFolderPress: (folderID: string) => void,
  isReverseSort: boolean,
): ReactNode => {
  if (!folders) {
    return <></>
  }

  const systemFolders = _.filter(folders, (folder) => {
    return folder.attributes.systemFolder
  })
  const listItems = getListItemsForFolders(systemFolders, t, onFolderPress)

  return <List items={listItems} />
}

export const getUserFolders = (folders: SecureMessagingFolderList, theme: VATheme, t: TFunction, onFolderPress: (folderID: string) => void, isReverseSort: boolean): ReactNode => {
  if (!folders) {
    return <></>
  }

  const userFolders = _.filter(folders, (folder) => {
    return !folder.attributes.systemFolder
  })
  const listItems = getListItemsForFolders(userFolders, t, onFolderPress)

  return <List items={listItems} />
}

type FoldersProps = Record<string, unknown>

const Folders: FC<FoldersProps> = () => {
  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { folders, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  useEffect(() => {
    dispatch(listFolders())
  }, [dispatch])

  const onFolderPress = (folderID: string): void => {
    navigateTo('FolderMessages', { folderID })()
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <Box {...testIdProps('Folders-page')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.folders'))} accessible={true}>
        <TextView variant="MobileBodyBold">{t('secureMessaging.folders')}</TextView>
      </Box>
      {getSystemFolders(folders || [], theme, t, onFolderPress, false)}
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.myFolders'))} accessible={true}>
        <TextView variant="MobileBodyBold">{t('secureMessaging.myFolders')}</TextView>
      </Box>
      {getUserFolders(folders || [], theme, t, onFolderPress, false)}
    </Box>
  )
}

export default Folders

import { TFunction } from 'i18next'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'

import _ from 'underscore'

import { Box, List, ListItemObj, LoadingComponent, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingFolderList } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { VATheme } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

const getListItemsForFolders = (listOfFolders: SecureMessagingFolderList, t: TFunction, onFolderPress: (folderID: string) => void): Array<ListItemObj> => {
  const listItems: Array<ListItemObj> = []

  _.forEach(listOfFolders, (folder) => {
    const { attributes } = folder
    const { name, count, unreadCount } = attributes

    // TODO: bold for unread messages
    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: name }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: count }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: unreadCount }) },
    ]

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

type FoldersProps = Record<string, unknown>

const Inbox: FC<FoldersProps> = () => {
  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { folders, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const onFolderPress = (folderID: string): void => {
    navigateTo('FolderMessages', { folderID })()
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <Box {...testIdProps('Folders-page')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('upcomingAppointments.confirmedApptsDisplayed'))} accessible={true}>
        <TextView variant="MobileBody">{t('upcomingAppointments.confirmedApptsDisplayed')}</TextView>
      </Box>
      {getFolders(folders || [], theme, t, onFolderPress, false)}
    </Box>
  )
}

export default Inbox

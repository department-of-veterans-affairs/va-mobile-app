import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'

import React, { FC, ReactNode, useEffect } from 'react'

import _ from 'underscore'

import { Box, LoadingComponent, TextLine, TextLinesList, TextListItemObj, TextView } from 'components'
import { HIDDEN_FOLDERS } from 'constants/secureMessaging'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingFolderList } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { VATheme } from 'styles/theme'
import { getTestIDFromTextLines, testIdProps } from 'utils/accessibility'
import { listFolders } from 'store/actions'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

const getListItemsForFolders = (listOfFolders: SecureMessagingFolderList, t: TFunction, onFolderPress: (folderID: number, folderName: string) => void): Array<TextListItemObj> => {
  const listItems: Array<TextListItemObj> = []

  _.forEach(listOfFolders, (folder) => {
    const { attributes } = folder
    const {
      name,
      // count,
      // unreadCount
    } = attributes

    const textLines: Array<TextLine> = [{ text: t('common:text.raw', { text: name }) }]

    if (!HIDDEN_FOLDERS.has(name)) {
      listItems.push({
        textLines,
        onPress: () => onFolderPress(folder.id, name),
        a11yHintText: t('secureMessaging.viewMessage.a11yHint'),
        testId: getTestIDFromTextLines(textLines),
      })
    }
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

  return <TextLinesList items={listItems} />
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
  const listItems = getListItemsForFolders(userFolders, t, onFolderPress)

  return <TextLinesList items={listItems} />
}

type FoldersProps = Record<string, unknown>

const Folders: FC<FoldersProps> = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { folders, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  useEffect(() => {
    dispatch(listFolders())
  }, [dispatch])

  const onFolderPress = (folderID: number, folderName: string): void => {
    navigateTo('FolderMessages', { folderID, folderName })()
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <Box {...testIdProps('Folders-page')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.folders'))} accessible={true}>
        <TextView variant="MobileBodyBold">{t('secureMessaging.folders')}</TextView>
      </Box>
      {getSystemFolders(folders || [], theme, t, onFolderPress)}
      <Box mx={theme.dimensions.gutter} my={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.myFolders'))} accessible={true}>
        <TextView variant="MobileBodyBold">{t('secureMessaging.myFolders')}</TextView>
      </Box>
      {getUserFolders(folders || [], theme, t, onFolderPress)}
    </Box>
  )
}

export default Folders

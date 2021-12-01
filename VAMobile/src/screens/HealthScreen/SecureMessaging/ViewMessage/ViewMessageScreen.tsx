import { InteractionManager, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, Ref, useEffect, useState } from 'react'
import _ from 'underscore'

import { AlertBox, BackButton, Box, ErrorComponent, LoadingComponent, PickerItem, TextView, VAButton, VAIconProps, VAModalPicker, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DateTime } from 'luxon'
import { FolderNameTypeConstants, REPLY_WINDOW_IN_DAYS, TRASH_FOLDER_NAME } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingMessageAttributes, SecureMessagingMessageMap, SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { deleteMessage, getMessage, getThread, moveMessage } from 'store/actions'
import { formatSubject } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useAutoScrollToElement, useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import CollapsibleMessage from './CollapsibleMessage'
import ReplyMessageFooter from '../ReplyMessageFooter/ReplyMessageFooter'

type ViewMessageScreenProps = StackScreenProps<HealthStackParamList, 'ViewMessageScreen'>

/**
 * Accepts a message, map of all messages, and array of messageIds in the current thread.  Gets each messageId from the message map, sorts by
 * sentDate ascending, and returns an array of <CollapsibleMessages/>
 */
export const renderMessages = (message: SecureMessagingMessageAttributes, messagesById: SecureMessagingMessageMap, thread: Array<number>, messageRef?: Ref<View>): ReactNode => {
  const threadMessages = thread.map((messageID) => messagesById[messageID]).sort((message1, message2) => (message1.sentDate < message2.sentDate ? -1 : 1))

  return threadMessages.map(
    (m) =>
      m &&
      m.messageId && (
        <CollapsibleMessage
          key={m.messageId}
          message={m}
          isInitialMessage={m.messageId === message.messageId}
          collapsibleMessageRef={m.messageId === message.messageId ? messageRef : undefined}
        />
      ),
  )
}

const ViewMessageScreen: FC<ViewMessageScreenProps> = ({ route, navigation }) => {
  const messageID = Number(route.params.messageID)
  const currentFolderID = Number(route.params.folderID)
  const currentPage = Number(route.params.currentPage)
  const messagesLeft = Number(route.params.messagesLeft)
  const [scrollRef, messageRef, scrollToSelectedMessage] = useAutoScrollToElement()
  const [isTransitionComplete, setIsTransitionComplete] = useState(false)
  const [newCurrentFolderID, setNewCurrentFolderID] = useState<string>(currentFolderID.toString())

  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { messagesById, threads, loading, messageIDsOfError, folders, movingMessage } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const message = messagesById?.[messageID]
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))
  const subject = message ? message.subject : ''
  const category = message ? message.category : 'OTHER'

  useEffect(() => {
    dispatch(getMessage(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))
    dispatch(getThread(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))

    InteractionManager.runAfterInteractions(() => {
      setIsTransitionComplete(true)
    })
  }, [messageID, dispatch])

  useEffect(() => {
    if (!loading && isTransitionComplete) {
      scrollToSelectedMessage()
    }
  }, [loading, isTransitionComplete, scrollToSelectedMessage])

  const getfolderName = (id: string) => {
    return _.filter(folders, (folder) => {
      return folder.id === id
    })[0].attributes.name
  }

  const onMove = (value: string) => {
    const newFolder = Number(value)
    if (currentFolderID !== newFolder) {
      setNewCurrentFolderID(value)
      if (newFolder === SecureMessagingSystemFolderIdConstants.DELETED) {
        dispatch(deleteMessage(messageID, currentFolderID, currentPage, messagesLeft))
      } else {
        dispatch(moveMessage(messageID, newFolder, currentFolderID, currentPage, messagesLeft))
      }
    }
  }

  const getFolders = (): PickerItem[] => {
    let indexOfDeleted: number | undefined
    const filteredFolder = _.filter(folders, (folder) => {
      const folderName = folder.attributes.name
      return folderName !== FolderNameTypeConstants.drafts && folderName !== FolderNameTypeConstants.sent
    }).map((folder, index) => {
      let label = folder.attributes.name

      const icon = {
        fill: 'dark',
        height: theme.fontSizes.MobileBody.fontSize,
        width: theme.fontSizes.MobileBody.fontSize,
        name: 'FolderSolid',
      } as VAIconProps

      if (label === FolderNameTypeConstants.deleted) {
        label = TRASH_FOLDER_NAME
        icon.fill = 'error'
        icon.name = 'TrashSolid'
        indexOfDeleted = index
      }

      return {
        label,
        value: folder.id,
        icon,
      }
    })

    if (indexOfDeleted !== undefined) {
      filteredFolder.unshift(filteredFolder.splice(indexOfDeleted, 1)[0])
    }

    return filteredFolder
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => (
        <BackButton onPress={navigation.goBack} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} focusOnButton={false} showCarat={true} />
      ),
      headerRight: () =>
        currentFolderID !== SecureMessagingSystemFolderIdConstants.SENT ? (
          <VAModalPicker
            displayButton={true}
            selectedValue={newCurrentFolderID}
            onSelectionChange={onMove}
            pickerOptions={getFolders()}
            labelKey={'common:pickerMoveMessageToFolder'}
            buttonText={'common:pickerLaunchBtn'}
            confirmBtnText={'common:pickerLaunchBtn'}
          />
        ) : (
          <></>
        ),
    })
  })

  // If error is caused by an individual message, we want the error alert to be contained to that message, not to take over the entire screen
  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID) && !messageIDsOfError) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID} />
  }

  if (loading || !isTransitionComplete || movingMessage) {
    return (
      <LoadingComponent text={movingMessage ? t('secureMessaging.movingMessage', { folderName: getfolderName(newCurrentFolderID) }) : t('secureMessaging.viewMessage.loading')} />
    )
  }

  if (!message || !messagesById || !thread) {
    // return empty /error  state
    // do not replace with error component otherwise user will always see a red error flash right before their message loads
    return <></>
  }

  const replyExpired = DateTime.fromISO(message.sentDate).diffNow('days').days < REPLY_WINDOW_IN_DAYS

  const onPressCompose = navigateTo('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  return (
    <>
      <VAScrollView {...testIdProps('ViewMessage-page')} scrollViewRef={scrollRef}>
        <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
          <Box borderColor={'primary'} borderBottomWidth={'default'} p={theme.dimensions.cardPadding}>
            <TextView variant="BitterBoldHeading" accessibilityRole={'header'}>
              {formatSubject(category, subject, t)}
            </TextView>
          </Box>
          {renderMessages(message, messagesById, thread, messageRef)}
        </Box>
        {replyExpired && (
          <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
            <AlertBox background={'noCardBackground'} border={'warning'} title={t('secureMessaging.reply.youCanNoLonger')} text={t('secureMessaging.reply.olderThan45Days')}>
              <Box mt={theme.dimensions.standardMarginBetween}>
                <VAButton
                  label={t('secureMessaging.composeMessage.new')}
                  onPress={onPressCompose}
                  buttonType={'buttonPrimary'}
                  a11yHint={t('secureMessaging.composeMessage.new.a11yHint')}
                />
              </Box>
            </AlertBox>
          </Box>
        )}
      </VAScrollView>
      {!replyExpired && <ReplyMessageFooter messageID={messageID} />}
    </>
  )
}

export default ViewMessageScreen

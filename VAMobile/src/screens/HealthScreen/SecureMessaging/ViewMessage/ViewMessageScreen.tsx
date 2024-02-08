import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { DateTime } from 'luxon'
import _ from 'underscore'

import {
  AlertBox,
  Box,
  ChildTemplate,
  ErrorComponent,
  LoadingComponent,
  PickerItem,
  TextView,
  VAIconProps,
  VAModalPicker,
} from 'components'
import { SnackbarMessages } from 'components/SnackBar'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, REPLY_WINDOW_IN_DAYS } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { RootState } from 'store'
import {
  SecureMessagingMessageAttributes,
  SecureMessagingMessageMap,
  SecureMessagingSystemFolderIdConstants,
} from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { DemoState } from 'store/slices/demoSlice'
import {
  SecureMessagingState,
  getMessage,
  getThread,
  listFolders,
  moveMessage,
} from 'store/slices/secureMessagingSlice'
import { GenerateFolderMessage } from 'translations/en/functions'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useDowntimeByScreenID, useError, useTheme } from 'utils/hooks'
import { getfolderName } from 'utils/secureMessaging'
import { screenContentAllowed } from 'utils/waygateConfig'

import CollapsibleMessage from './CollapsibleMessage'
import MessageCard from './MessageCard'

type ViewMessageScreenProps = StackScreenProps<HealthStackParamList, 'ViewMessage'>

/**
 * Accepts a message, map of all messages, and array of messageIds in the current thread.  Gets each messageId from the message map, sorts by
 * sentDate ascending, and returns an array of <CollapsibleMessages/>
 */
export function renderMessages(
  message: SecureMessagingMessageAttributes,
  messagesById: SecureMessagingMessageMap,
  thread: Array<number>,
  hideMessage = false,
) {
  const threadMessages = thread
    .map((messageID) => messagesById[messageID])
    .sort((message1, message2) => (message1.sentDate > message2.sentDate ? -1 : 1))

  return threadMessages.map(
    (m) =>
      m &&
      m.messageId && (
        <CollapsibleMessage
          key={m.messageId}
          message={m}
          isInitialMessage={hideMessage && m.messageId === message.messageId}
        />
      ),
  )
}

const screenID = ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID

function ViewMessageScreen({ route, navigation }: ViewMessageScreenProps) {
  const messageID = Number(route.params.messageID)
  const currentFolderIdParam = Number(route.params.folderID) || SecureMessagingSystemFolderIdConstants.INBOX
  const currentPage = Number(route.params.currentPage)
  const messagesLeft = Number(route.params.messagesLeft)
  const [newCurrentFolderID, setNewCurrentFolderID] = useState<string>(currentFolderIdParam.toString())
  const [showModalPicker, setShowModalPicker] = useState(false)

  /* useref is used to persist the folder the message is in.
   * Example: the message was first in test folder and the user moves it to test2. The user is still
   * under folder test but the message is not. So if the user selects move again and move to another
   * folder test3 and clicks undo you want the message to go to test2 not test which the user is on.
   * This makes the message independent from the folder and acts like gmail when the user is in the email details
   */
  const folderWhereMessageIs = useRef(currentFolderIdParam.toString())
  const folderWhereMessagePreviousewas = useRef(folderWhereMessageIs.current)

  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {
    messagesById,
    threads,
    loading,
    loadingFile,
    loadingInbox,
    messageIDsOfError,
    folders,
    movingMessage,
    isUndo,
    moveMessageFailed,
  } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)

  const message = messagesById?.[messageID]
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))

  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const smNotInDowntime = !useDowntimeByScreenID(screenID)
  const isScreenContentAllowed = screenContentAllowed('WG_ViewMessage')

  // have to use uselayout due to the screen showing in white or showing the previouse data
  useLayoutEffect(() => {
    // Only get message and thread when inbox isn't being fetched
    // to avoid a race condition with writing to `messagesById`
    if (isScreenContentAllowed && !loadingInbox && smNotInDowntime) {
      dispatch(getMessage(messageID, screenID))
      dispatch(getThread(messageID, screenID))
    }
  }, [loadingInbox, messageID, smNotInDowntime, dispatch, isScreenContentAllowed])

  useEffect(() => {
    if (isUndo || moveMessageFailed) {
      setNewCurrentFolderID(folderWhereMessagePreviousewas.current)
      folderWhereMessageIs.current = folderWhereMessagePreviousewas.current
    }
  }, [isUndo, currentFolderIdParam, moveMessageFailed])

  useEffect(() => {
    if (isScreenContentAllowed && !folders.length) {
      dispatch(listFolders(screenID))
    }
  }, [dispatch, folders, isScreenContentAllowed])

  const getFolders = (): PickerItem[] => {
    const filteredFolder = _.filter(folders, (folder) => {
      const folderName = folder.attributes.name
      return (
        folderName !== FolderNameTypeConstants.drafts &&
        folderName !== FolderNameTypeConstants.sent &&
        folderName !== FolderNameTypeConstants.deleted
      )
    }).map((folder) => {
      const label = folder.attributes.name

      const icon = {
        fill: 'defaultMenuItem',
        height: theme.fontSizes.MobileBody.fontSize,
        width: theme.fontSizes.MobileBody.fontSize,
        name: 'Folder',
      } as VAIconProps

      if (label === FolderNameTypeConstants.inbox) {
        icon.fill = 'defaultMenuItem'
        icon.name = 'Inbox'
      }

      return {
        label,
        value: folder.id,
        icon,
      }
    })
    return filteredFolder
  }

  const backLabel =
    Number(folderWhereMessagePreviousewas.current) === SecureMessagingSystemFolderIdConstants.INBOX
      ? t('messages')
      : t('text.raw', { text: getfolderName(folderWhereMessagePreviousewas.current, folders) })

  // If error is caused by an individual message, we want the error alert to be contained to that message, not to take over the entire screen
  if (useError(screenID) || messageIDsOfError?.includes(messageID)) {
    return (
      <ChildTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('reviewMessage')}>
        <ErrorComponent screenID={screenID} />
      </ChildTemplate>
    )
  }

  if (loading || loadingFile || loadingInbox || movingMessage) {
    return (
      <ChildTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('reviewMessage')}>
        <LoadingComponent
          text={
            loadingFile
              ? t('secureMessaging.viewMessage.loadingAttachment')
              : movingMessage
                ? t('secureMessaging.movingMessage')
                : t('secureMessaging.viewMessage.loading')
          }
        />
      </ChildTemplate>
    )
  }

  if (!message || !messagesById || !thread) {
    // return empty /error  state
    // do not replace with error component otherwise user will always see a red error flash right before their message loads
    return (
      <ChildTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('reviewMessage')}>
        <></>
      </ChildTemplate>
    )
  }

  const replyExpired =
    demoMode && message.messageId === 2092809
      ? false
      : DateTime.fromISO(message.sentDate).diffNow('days').days < REPLY_WINDOW_IN_DAYS

  const onMove = (value: string) => {
    setShowModalPicker(false)
    const currentFolder = Number(folderWhereMessageIs.current)
    folderWhereMessagePreviousewas.current = currentFolder.toString()
    const newFolder = Number(value)
    const snackbarMessages: SnackbarMessages = {
      successMsg: GenerateFolderMessage(t, newFolder, folders, false, false),
      errorMsg: GenerateFolderMessage(t, newFolder, folders, false, true),
      undoMsg: GenerateFolderMessage(t, currentFolder, folders, true, false),
      undoErrorMsg: GenerateFolderMessage(t, currentFolder, folders, true, true),
    }
    if (folderWhereMessageIs.current !== value) {
      setNewCurrentFolderID(value)
      folderWhereMessageIs.current = value
      dispatch(
        moveMessage(
          snackbarMessages,
          messageID,
          newFolder,
          currentFolder,
          currentFolderIdParam,
          currentPage,
          messagesLeft,
          false,
          folders,
        ),
      )
      if (newFolder === SecureMessagingSystemFolderIdConstants.DELETED) {
        navigation.goBack()
      }
    }
  }

  const moveIconProps: VAIconProps = {
    name: 'Folder',
  }

  const headerButton =
    currentFolderIdParam === SecureMessagingSystemFolderIdConstants.SENT
      ? undefined
      : {
          label: t('pickerLaunchBtn'),
          icon: moveIconProps,
          onPress: () => {
            logAnalyticsEvent(Events.vama_sm_move())
            setShowModalPicker(true)
          },
        }

  return (
    <ChildTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('reviewMessage')}
      headerButton={headerButton}
      testID="viewMessageTestID">
      {headerButton && showModalPicker && (
        <VAModalPicker
          selectedValue={newCurrentFolderID}
          onSelectionChange={onMove}
          onClose={() => setShowModalPicker(false)}
          pickerOptions={getFolders()}
          labelKey={'pickerMoveMessageToFolder'}
          buttonText={'pickerLaunchBtn'}
          confirmBtnText={'pickerLaunchBtn'}
          key={newCurrentFolderID}
          showModalByDefault={true}
        />
      )}
      {replyExpired && (
        <Box my={theme.dimensions.standardMarginBetween}>
          <AlertBox border={'warning'} title={t('secureMessaging.reply.youCanNoLonger')}>
            <TextView mt={theme.dimensions.standardMarginBetween} variant="MobileBody">
              {t('secureMessaging.reply.olderThan45Days')}
            </TextView>
          </AlertBox>
        </Box>
      )}
      <MessageCard message={message} />
      {thread.length > 1 && (
        <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
          <Box accessible={true} accessibilityRole={'header'}>
            <TextView
              ml={theme.dimensions.gutter}
              mt={theme.dimensions.standardMarginBetween}
              mb={theme.dimensions.condensedMarginBetween}
              variant={'MobileBodyBold'}>
              {t('secureMessaging.reply.messageConversation')}
            </TextView>
          </Box>
          {renderMessages(message, messagesById, thread, true)}
        </Box>
      )}
    </ChildTemplate>
  )
}

export default ViewMessageScreen

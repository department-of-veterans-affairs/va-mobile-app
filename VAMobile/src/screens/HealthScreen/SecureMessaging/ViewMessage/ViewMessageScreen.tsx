import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import _ from 'underscore'

import {
  secureMessagingKeys,
  useFolderMessages,
  useFolders,
  useMessage,
  useMoveMessage,
  useThread,
} from 'api/secureMessaging'
import {
  MoveMessageParameters,
  SecureMessagingAttachment,
  SecureMessagingFolderList,
  SecureMessagingMessageAttributes,
  SecureMessagingMessageList,
  SecureMessagingSystemFolderIdConstants,
} from 'api/types'
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
import { Events, UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, READ, REPLY_WINDOW_IN_DAYS } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { DemoState } from 'store/slices/demoSlice'
import { GenerateFolderMessage } from 'translations/en/functions'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { showSnackBar } from 'utils/common'
import { useAppDispatch, useDowntimeByScreenID, useTheme } from 'utils/hooks'
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
  thread: SecureMessagingMessageList,
  hideMessage = false,
) {
  const threadMessages = thread.sort((message1, message2) =>
    message1.attributes.sentDate > message2.attributes.sentDate ? -1 : 1,
  )

  return threadMessages.map(
    (m) =>
      m &&
      m.attributes.messageId && (
        <CollapsibleMessage
          key={m.attributes.messageId}
          message={m.attributes}
          isInitialMessage={hideMessage && m.attributes.messageId === message.messageId}
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
  const queryClient = useQueryClient()

  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const smNotInDowntime = !useDowntimeByScreenID(screenID)
  const isScreenContentAllowed = screenContentAllowed('WG_ViewMessage')
  const { mutate: moveMessage, isPending: loadingMoveMessage } = useMoveMessage()
  const {
    data: messageData,
    isError: messageError,
    isLoading: loadingMessage,
    isFetched: messageFetched,
  } = useMessage(messageID, {
    enabled: isScreenContentAllowed && smNotInDowntime,
  })
  const {
    data: threadData,
    isError: threadError,
    isLoading: loadingThread,
    isFetched: threadFetched,
  } = useThread(messageID, true, {
    enabled: isScreenContentAllowed && smNotInDowntime,
  })
  const {
    data: foldersData,
    isError: foldersError,
    isLoading: loadingFolder,
  } = useFolders({
    enabled: isScreenContentAllowed && smNotInDowntime,
  })
  const { refetch: refetchInbox } = useFolderMessages(currentFolderIdParam, currentPage, {
    enabled: false,
  })
  const folders = foldersData?.data || ([] as SecureMessagingFolderList)
  const message = messageData?.data.attributes || ({} as SecureMessagingMessageAttributes)
  const includedAttachments = messageData?.included?.filter((included) => included.type === 'attachments')
  if (includedAttachments?.length) {
    const attachments: Array<SecureMessagingAttachment> = includedAttachments.map((attachment) => ({
      id: attachment.id,
      filename: attachment.attributes.name,
      link: attachment.links.download,
      size: attachment.attributes.attachmentSize,
    }))

    message.attachments = attachments
  }
  const thread = threadData?.data || ([] as SecureMessagingMessageList)

  useEffect(() => {
    if (threadFetched) {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
    }
  }, [threadFetched])

  useEffect(() => {
    if (messageFetched && message.readReceipt !== READ && !demoMode) {
      refetchInbox()
    }
  }, [messageFetched, message.readReceipt, demoMode, queryClient, refetchInbox])

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
  if (foldersError || messageError || threadError || !smNotInDowntime) {
    return (
      <ChildTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('reviewMessage')}>
        <ErrorComponent screenID={screenID} />
      </ChildTemplate>
    )
  }

  if (loadingFolder || loadingThread || loadingMessage || loadingMoveMessage) {
    return (
      <ChildTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('reviewMessage')}>
        <LoadingComponent
          text={loadingMoveMessage ? t('secureMessaging.movingMessage') : t('secureMessaging.viewMessage.loading')}
        />
      </ChildTemplate>
    )
  }

  if (!message || !thread) {
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
      const folder = (): string => {
        switch (newFolder) {
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
      const page = currentPage === 1 ? currentPage : messagesLeft === 1 ? currentPage - 1 : currentPage
      const mutateOptions = {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [secureMessagingKeys.message, messageID] })
          queryClient.invalidateQueries({ queryKey: [secureMessagingKeys.folderMessages, currentFolderIdParam, page] })
          logAnalyticsEvent(Events.vama_sm_move_outcome(folder()))
          showSnackBar(
            snackbarMessages.successMsg,
            dispatch,
            () => {
              const undoParams: MoveMessageParameters = { messageID: messageID, newFolderID: newFolder }
              const undoMutateOptions = {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: [secureMessagingKeys.message, messageID] })
                  queryClient.invalidateQueries({
                    queryKey: [secureMessagingKeys.folderMessages, currentFolderIdParam, currentPage],
                  })
                  logAnalyticsEvent(Events.vama_sm_move_outcome(folder()))
                  showSnackBar(
                    snackbarMessages.undoMsg ? snackbarMessages.undoMsg : snackbarMessages.successMsg,
                    dispatch,
                    undefined,
                    true,
                    false,
                    true,
                  )
                  setNewCurrentFolderID(folderWhereMessagePreviousewas.current)
                  folderWhereMessageIs.current = folderWhereMessagePreviousewas.current
                },
                onError: () => {
                  showSnackBar(
                    snackbarMessages.undoErrorMsg ? snackbarMessages.undoErrorMsg : snackbarMessages.errorMsg,
                    dispatch,
                    () => moveMessage(undoParams, undoMutateOptions),
                    false,
                    true,
                    true,
                  )
                  setNewCurrentFolderID(folderWhereMessagePreviousewas.current)
                  folderWhereMessageIs.current = folderWhereMessagePreviousewas.current
                },
              }
              moveMessage(undoParams, undoMutateOptions)
            },
            false,
            false,
            true,
          )
        },
        onError: () => {
          showSnackBar(
            snackbarMessages.undoErrorMsg ? snackbarMessages.undoErrorMsg : snackbarMessages.errorMsg,
            dispatch,
            () => moveMessage(params, mutateOptions),
            false,
            true,
            true,
          )
          setNewCurrentFolderID(folderWhereMessagePreviousewas.current)
          folderWhereMessageIs.current = folderWhereMessagePreviousewas.current
        },
      }
      const params: MoveMessageParameters = { messageID: messageID, newFolderID: newFolder }
      moveMessage(params, mutateOptions)
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
          {renderMessages(message, thread, true)}
        </Box>
      )}
    </ChildTemplate>
  )
}

export default ViewMessageScreen

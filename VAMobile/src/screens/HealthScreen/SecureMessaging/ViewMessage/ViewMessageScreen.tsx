import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'
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
  SecureMessagingFolderMessagesGetData,
  SecureMessagingFoldersGetData,
  SecureMessagingMessageAttributes,
  SecureMessagingMessageData,
  SecureMessagingMessageGetData,
  SecureMessagingMessageList,
  SecureMessagingSystemFolderIdConstants,
} from 'api/types'
import {
  AlertWithHaptics,
  Box,
  ChildTemplate,
  ErrorComponent,
  LoadingComponent,
  PickerItem,
  TextView,
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
import { useReviewEvent } from 'utils/inAppReviews'
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
  const registerReviewEvent = useReviewEvent(true)
  const queryClient = useQueryClient()

  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const smNotInDowntime = !useDowntimeByScreenID(screenID)
  const isScreenContentAllowed = screenContentAllowed('WG_ViewMessage')
  const { mutate: moveMessage, isPending: loadingMoveMessage } = useMoveMessage()
  const {
    data: messageData,
    error: messageError,
    isFetching: loadingMessage,
    isFetched: messageFetched,
    refetch: refetchMessage,
  } = useMessage(messageID, {
    enabled: isScreenContentAllowed && smNotInDowntime,
  })
  const {
    data: threadData,
    error: threadError,
    isFetching: loadingThread,
    isFetched: threadFetched,
    refetch: refetchThread,
  } = useThread(messageID, true, {
    enabled: isScreenContentAllowed && smNotInDowntime,
  })
  const {
    data: foldersData,
    error: foldersError,
    isFetching: loadingFolder,
    refetch: refetchFolders,
  } = useFolders({
    enabled: isScreenContentAllowed && smNotInDowntime,
  })

  const {
    data: inboxMessagesData,
    isFetching: loadingFolderMessages,
    error: folderMessagesError,
    refetch: refetchFolderMessages,
  } = useFolderMessages(currentFolderIdParam, {
    enabled: isScreenContentAllowed && smNotInDowntime,
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
      registerReviewEvent()
    }
  }, [threadFetched, registerReviewEvent])

  useEffect(() => {
    if (messageFetched && currentFolderIdParam === SecureMessagingSystemFolderIdConstants.INBOX && currentPage) {
      let updateQueries = false
      const newInboxMessages = inboxMessagesData?.data.map((m) => {
        if (m.attributes.messageId === message.messageId && m.attributes.readReceipt !== READ) {
          updateQueries = true
          m.attributes.readReceipt = READ
          const oldMessageAttributes = messageData?.data.attributes || ({} as SecureMessagingMessageAttributes)
          oldMessageAttributes.readReceipt = READ
          const newMessage = {
            attributes: oldMessageAttributes,
            type: messageData?.data.type,
            id: messageData?.data.id,
          } as SecureMessagingMessageData
          const newMessageData = { data: newMessage, included: messageData?.included } as SecureMessagingMessageGetData
          queryClient.setQueryData([secureMessagingKeys.message, message.messageId], newMessageData)
        }
        return m
      })
      if (updateQueries) {
        const newData = { ...inboxMessagesData, data: newInboxMessages } as SecureMessagingFolderMessagesGetData
        queryClient.setQueryData([secureMessagingKeys.folderMessages, currentFolderIdParam, currentPage], newData)
        if (foldersData) {
          let inboxUnreadCount = foldersData.inboxUnreadCount
          const newFolders = foldersData.data.map((folder) => {
            if (folder.attributes.name === FolderNameTypeConstants.inbox) {
              folder.attributes.unreadCount = folder.attributes.unreadCount > 0 ? folder.attributes.unreadCount - 1 : 0
              inboxUnreadCount = folder.attributes.unreadCount
            }
            return folder
          }) as SecureMessagingFolderList
          queryClient.setQueryData(secureMessagingKeys.folders, {
            ...foldersData,
            data: newFolders,
            inboxUnreadCount,
          } as SecureMessagingFoldersGetData)
        }
      }
    }
  }, [
    messageFetched,
    message.readReceipt,
    queryClient,
    message.messageId,
    currentFolderIdParam,
    currentPage,
    messageData?.included,
    foldersData,
    messageData,
    inboxMessagesData,
  ])

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
        fill: 'base',
        height: theme.fontSizes.MobileBody.fontSize,
        width: theme.fontSizes.MobileBody.fontSize,
        name: 'Folder',
      } as IconProps

      if (label === FolderNameTypeConstants.inbox) {
        icon.fill = 'base'
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

  const replyExpired =
    demoMode && message?.messageId === 2092809
      ? false
      : DateTime.fromISO(message?.sentDate).diffNow('days').days < REPLY_WINDOW_IN_DAYS

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
      const mutateOptions = {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [secureMessagingKeys.message, messageID] })
          queryClient.invalidateQueries({ queryKey: [secureMessagingKeys.folderMessages, currentFolderIdParam] })
          logAnalyticsEvent(Events.vama_sm_move_outcome(folder()))
          showSnackBar(
            snackbarMessages.successMsg,
            dispatch,
            () => {
              const undoParams: MoveMessageParameters = { messageID: messageID, newFolderID: currentFolder }
              const undoMutateOptions = {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: [secureMessagingKeys.message, messageID] })
                  queryClient.invalidateQueries({
                    queryKey: [secureMessagingKeys.folderMessages, currentFolderIdParam],
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

  const moveIconProps: IconProps = {
    name: 'Folder',
    fill: theme.colors.icon.active,
  }

  // If error is caused by an individual message, we want the error alert to be
  // contained to that message, not to take over the entire screen
  const hasError = folderMessagesError || foldersError || messageError || threadError || !smNotInDowntime
  const isLoading = loadingFolder || loadingThread || loadingMessage || loadingMoveMessage || loadingFolderMessages
  const isEmpty = !message || !thread
  const loadingText = loadingMoveMessage ? t('secureMessaging.movingMessage') : t('secureMessaging.viewMessage.loading')

  const headerButton =
    hasError || isEmpty || isLoading || currentFolderIdParam === SecureMessagingSystemFolderIdConstants.SENT
      ? undefined
      : {
          label: t('pickerLaunchBtn'),
          icon: moveIconProps,
          onPress: () => {
            logAnalyticsEvent(Events.vama_sm_move())
            setShowModalPicker(true)
          },
          testID: 'pickerMoveMessageID',
        }

  return (
    <ChildTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('reviewMessage')}
      headerButton={headerButton}
      testID="viewMessageTestID"
      backLabelTestID="backToMessagesID">
      {isLoading ? (
        <LoadingComponent text={loadingText} />
      ) : hasError ? (
        <ErrorComponent
          screenID={screenID}
          error={folderMessagesError || foldersError || messageError || threadError}
          onTryAgain={
            folderMessagesError
              ? refetchFolderMessages
              : foldersError
                ? refetchFolders
                : messageError
                  ? refetchMessage
                  : threadError
                    ? refetchThread
                    : undefined
          }
        />
      ) : isEmpty ? (
        // return empty /error  state
        // do not replace with error component otherwise user will always see a red error flash right before their message loads
        <></>
      ) : (
        <>
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
              cancelTestID="pickerMoveMessageCancelID"
              confirmTestID="pickerMoveMessageConfirmID"
            />
          )}
          {replyExpired && (
            <Box my={theme.dimensions.standardMarginBetween}>
              <AlertWithHaptics
                variant="warning"
                header={t('secureMessaging.reply.youCanNoLonger')}
                description={t('secureMessaging.reply.olderThan45Days')}
                testID="secureMessagingOlderThan45DaysAlertID"
              />
            </Box>
          )}
          <MessageCard message={message} />
          {thread.length > 0 && (
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
        </>
      )}
    </ChildTemplate>
  )
}

export default ViewMessageScreen

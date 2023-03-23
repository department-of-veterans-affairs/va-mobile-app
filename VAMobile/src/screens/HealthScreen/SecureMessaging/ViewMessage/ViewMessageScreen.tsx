import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import _ from 'underscore'

import { AlertBox, BackButton, Box, ChildTemplate, ErrorComponent, LoadingComponent, PickerItem, TextView, VAIconProps, VAModalPicker } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DateTime } from 'luxon'
import { DemoState } from 'store/slices/demoSlice'
import { FolderNameTypeConstants, REPLY_WINDOW_IN_DAYS, TRASH_FOLDER_NAME } from 'constants/secureMessaging'
import { GenerateFolderMessage } from 'translations/en/functions'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingMessageAttributes, SecureMessagingMessageMap, SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { SecureMessagingState, getMessage, getThread, moveMessage } from 'store/slices/secureMessagingSlice'
import { SnackbarMessages } from 'components/SnackBar'
import { formatSubject, getfolderName } from 'utils/secureMessaging'
import { useAppDispatch, useError, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import CollapsibleMessage from './CollapsibleMessage'
import ComposeMessageButton from '../ComposeMessageButton/ComposeMessageButton'
import ReplyMessageButton from '../ReplyMessageButton/ReplyMessageButton'

type ViewMessageScreenProps = StackScreenProps<HealthStackParamList, 'ViewMessageScreen'>

/**
 * Accepts a message, map of all messages, and array of messageIds in the current thread.  Gets each messageId from the message map, sorts by
 * sentDate ascending, and returns an array of <CollapsibleMessages/>
 */
export const renderMessages = (message: SecureMessagingMessageAttributes, messagesById: SecureMessagingMessageMap, thread: Array<number>): ReactNode => {
  const threadMessages = thread.map((messageID) => messagesById[messageID]).sort((message1, message2) => (message1.sentDate > message2.sentDate ? -1 : 1))

  return threadMessages.map((m) => m && m.messageId && <CollapsibleMessage key={m.messageId} message={m} isInitialMessage={m.messageId === message.messageId} />)
}

const ViewMessageScreen: FC<ViewMessageScreenProps> = ({ route, navigation }) => {
  const messageID = Number(route.params.messageID)
  const currentFolderIdParam = Number(route.params.folderID)
  const currentPage = Number(route.params.currentPage)
  const messagesLeft = Number(route.params.messagesLeft)
  const [newCurrentFolderID, setNewCurrentFolderID] = useState<string>(currentFolderIdParam.toString())
  const [showModalPicker, setShowModalPicker] = useState(false)

  /* useref is used to persist the folder the message is in Example the message was first in test folder and the user moves it to test2. The user is still under folder
    test but the message is not. So if the user selects move again and move to another folder test3 and clicks undo you want the message to go to test2 not test which
    the user is on. This makes the message independent from the folder and acts like gmail when the user is in the email details
  */
  const folderWhereMessageIs = useRef(currentFolderIdParam.toString())
  const folderWhereMessagePreviousewas = useRef(folderWhereMessageIs.current)

  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { messagesById, threads, loading, loadingFile, messageIDsOfError, folders, movingMessage, isUndo, moveMessageFailed } = useSelector<RootState, SecureMessagingState>(
    (state) => state.secureMessaging,
  )

  const message = messagesById?.[messageID]
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))
  const subject = message ? message.subject : ''
  const category = message ? message.category : 'OTHER'
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)

  // have to use uselayout due to the screen showing in white or showing the previouse data
  useLayoutEffect(() => {
    dispatch(getMessage(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))
    dispatch(getThread(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))
  }, [messageID, dispatch])

  useEffect(() => {
    if (isUndo || moveMessageFailed) {
      setNewCurrentFolderID(folderWhereMessagePreviousewas.current)
      folderWhereMessageIs.current = folderWhereMessagePreviousewas.current
    }
  }, [isUndo, currentFolderIdParam, moveMessageFailed])

  const getFolders = (): PickerItem[] => {
    let indexOfDeleted: number | undefined
    const filteredFolder = _.filter(folders, (folder) => {
      const folderName = folder.attributes.name
      return folderName !== FolderNameTypeConstants.drafts && folderName !== FolderNameTypeConstants.sent
    }).map((folder, index) => {
      let label = folder.attributes.name

      const icon = {
        fill: 'defaultMenuItem',
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

      if (label === FolderNameTypeConstants.inbox) {
        icon.fill = 'defaultMenuItem'
        icon.name = 'InboxSolid'
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
        <BackButton
          onPress={() => {
            navigation.goBack()
          }}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.back}
          showCarat={true}
        />
      ),
      headerRight: () =>
        currentFolderIdParam !== SecureMessagingSystemFolderIdConstants.SENT ? (
          <VAModalPicker
            displayButton={true}
            selectedValue={newCurrentFolderID}
            onSelectionChange={onMove}
            pickerOptions={getFolders()}
            labelKey={'common:pickerMoveMessageToFolder'}
            buttonText={'common:pickerLaunchBtn'}
            confirmBtnText={'common:pickerLaunchBtn'}
            key={newCurrentFolderID}
          />
        ) : (
          <></>
        ),
    })
  })

  const backLabel =
    Number(folderWhereMessagePreviousewas.current) === SecureMessagingSystemFolderIdConstants.INBOX
      ? tc('messages')
      : tc('text.raw', { text: getfolderName(folderWhereMessagePreviousewas.current, folders) })

  // If error is caused by an individual message, we want the error alert to be contained to that message, not to take over the entire screen
  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID) && !messageIDsOfError) {
    return (
      <ChildTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={tc('reviewMessage')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID} />
      </ChildTemplate>
    )
  }

  if (loading || loadingFile || movingMessage) {
    return (
      <ChildTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={tc('reviewMessage')}>
        <LoadingComponent
          text={loadingFile ? t('secureMessaging.viewMessage.loadingAttachment') : movingMessage ? t('secureMessaging.movingMessage') : t('secureMessaging.viewMessage.loading')}
        />
      </ChildTemplate>
    )
  }

  if (!message || !messagesById || !thread) {
    // return empty /error  state
    // do not replace with error component otherwise user will always see a red error flash right before their message loads
    return <></>
  }

  const replyExpired = demoMode && message.messageId === 2092809 ? false : DateTime.fromISO(message.sentDate).diffNow('days').days < REPLY_WINDOW_IN_DAYS

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
      dispatch(moveMessage(snackbarMessages, messageID, newFolder, currentFolder, currentFolderIdParam, currentPage, messagesLeft, false, folders))
      if (newFolder === SecureMessagingSystemFolderIdConstants.DELETED) {
        navigation.goBack()
      }
    }
  }

  const moveIconProps: VAIconProps = {
    name: 'FolderSolid',
    width: 22,
    height: 22,
    preventScaling: true,
    fill: 'link',
  }

  const headerButton =
    currentFolderIdParam === SecureMessagingSystemFolderIdConstants.SENT
      ? undefined
      : {
          label: tc('pickerLaunchBtn'),
          icon: moveIconProps,
          onPress: () => setShowModalPicker(true),
        }

  return (
    <ChildTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={tc('reviewMessage')} headerButton={headerButton}>
      {headerButton && showModalPicker && (
        <VAModalPicker
          selectedValue={newCurrentFolderID}
          onSelectionChange={onMove}
          onClose={() => setShowModalPicker(false)}
          pickerOptions={getFolders()}
          labelKey={'common:pickerMoveMessageToFolder'}
          buttonText={'common:pickerLaunchBtn'}
          confirmBtnText={'common:pickerLaunchBtn'}
          key={newCurrentFolderID}
          showModalByDefault={true}
        />
      )}
      {!replyExpired ? (
        <ReplyMessageButton messageID={messageID} />
      ) : (
        <Box>
          <ComposeMessageButton />
          <Box mt={theme.dimensions.standardMarginBetween}>
            <AlertBox border={'warning'} title={t('secureMessaging.reply.youCanNoLonger')} text={t('secureMessaging.reply.olderThan45Days')} />
          </Box>
        </Box>
      )}
      <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
        <Box borderColor={'primary'} borderBottomWidth={'default'} p={theme.dimensions.cardPadding}>
          <TextView variant="BitterBoldHeading" accessibilityRole={'header'}>
            {formatSubject(category, subject, t)}
          </TextView>
        </Box>
        {renderMessages(message, messagesById, thread)}
      </Box>
    </ChildTemplate>
  )
}

export default ViewMessageScreen

import { PixelRatio, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, Ref, useEffect, useLayoutEffect, useRef, useState } from 'react'
import _ from 'underscore'

import { AlertBox, BackButton, Box, ErrorComponent, LoadingComponent, PickerItem, TextView, VAButton, VAIconProps, VAModalPicker, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DateTime } from 'luxon'
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
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useAutoScrollToElement, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
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
          // if it is the only message in the thread no point of scrolling it will only scroll on large text and if there is more than one thread message
          collapsibleMessageRef={m.messageId === message.messageId && (threadMessages.length > 1 || PixelRatio.getFontScale() > 1) ? messageRef : undefined}
        />
      ),
  )
}

const ViewMessageScreen: FC<ViewMessageScreenProps> = ({ route, navigation }) => {
  const messageID = Number(route.params.messageID)
  const currentFolderIdParam = Number(route.params.folderID)
  const currentPage = Number(route.params.currentPage)
  const messagesLeft = Number(route.params.messagesLeft)
  const [scrollRef, messageRef, scrollToSelectedMessage, setShouldFocus] = useAutoScrollToElement()
  const [newCurrentFolderID, setNewCurrentFolderID] = useState<string>(currentFolderIdParam.toString())

  /* useref is used to persist the folder the message is in Example the message was first in test folder and the user moves it to test2. The user is still under folder
    test but the message is not. So if the user selects move again and move to another folder test3 and clicks undo you want the message to go to test2 not test which
    the user is on. This makes the message independent from the folder and acts like gmail when the user is in the email details
  */
  const folderWhereMessageIs = useRef(currentFolderIdParam.toString())
  const folderWhereMessagePreviousewas = useRef(folderWhereMessageIs.current)

  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { messagesById, threads, loading, messageIDsOfError, folders, movingMessage, isUndo, moveMessageFailed } = useSelector<RootState, SecureMessagingState>(
    (state) => state.secureMessaging,
  )

  const message = messagesById?.[messageID]
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))
  const subject = message ? message.subject : ''
  const category = message ? message.category : 'OTHER'

  // have to use uselayout due to the screen showing in white or showing the previouse data
  useLayoutEffect(() => {
    dispatch(getMessage(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))
    dispatch(getThread(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID))
  }, [messageID, dispatch])

  useEffect(() => {
    if (!loading) {
      scrollToSelectedMessage()
    }
  }, [loading, scrollToSelectedMessage])

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
          focusOnButton={false}
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

  // If error is caused by an individual message, we want the error alert to be contained to that message, not to take over the entire screen
  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID) && !messageIDsOfError) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID} />
  }

  if (loading || movingMessage) {
    return (
      <LoadingComponent
        text={
          movingMessage
            ? t('secureMessaging.movingMessage', { folderName: getfolderName(!isUndo ? newCurrentFolderID : folderWhereMessagePreviousewas.current, folders) })
            : t('secureMessaging.viewMessage.loading')
        }
      />
    )
  }

  if (!message || !messagesById || !thread) {
    // return empty /error  state
    // do not replace with error component otherwise user will always see a red error flash right before their message loads
    return <></>
  }

  const replyExpired = DateTime.fromISO(message.sentDate).diffNow('days').days < REPLY_WINDOW_IN_DAYS

  const onPressCompose = navigateTo('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })

  const onMove = (value: string) => {
    setShouldFocus(false)
    const currentFolder = Number(folderWhereMessageIs.current)
    folderWhereMessagePreviousewas.current = currentFolder.toString()
    const newFolder = Number(value)
    const withNavBar = replyExpired ? false : true
    const snackbarMessages: SnackbarMessages = {
      successMsg: GenerateFolderMessage(t, newFolder, folders, false, false),
      errorMsg: GenerateFolderMessage(t, newFolder, folders, false, true),
      undoMsg: GenerateFolderMessage(t, currentFolder, folders, true, false),
      undoErrorMsg: GenerateFolderMessage(t, currentFolder, folders, true, true),
    }
    if (folderWhereMessageIs.current !== value) {
      setNewCurrentFolderID(value)
      folderWhereMessageIs.current = value
      dispatch(moveMessage(snackbarMessages, messageID, newFolder, currentFolder, currentFolderIdParam, currentPage, messagesLeft, false, folders, withNavBar))
    }
  }

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
            <AlertBox border={'warning'} title={t('secureMessaging.reply.youCanNoLonger')} text={t('secureMessaging.reply.olderThan45Days')}>
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

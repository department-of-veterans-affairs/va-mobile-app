import { BackButton, Box, ButtonTypesConstants, CrisisLineCta, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { FolderNameTypeConstants, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingSystemFolderIdConstants, SecureMessagingTabTypesConstants } from 'store/api/types'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { resetHasLoadedRecipients, resetSaveDraftComplete, resetSaveDraftFailed, resetSendMessageFailed, saveDraft, updateSecureMessagingTab } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useDispatch } from 'react-redux'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ConfirmationAlert from 'components/ConfirmationAlert'
import React, { FC, ReactNode, useEffect } from 'react'

type ComposeCancelConfirmationProps = StackScreenProps<HealthStackParamList, 'ComposeCancelConfirmation'>

const ComposeCancelConfirmation: FC<ComposeCancelConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { replyToMessageID, messageData, draftMessageID, isFormValid, origin } = route.params
  const isReply = origin === FormHeaderTypeConstants.reply
  const isEditDraft = origin === FormHeaderTypeConstants.draft

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} />
      ),
      headerTitle: getHeaderTitle(),
    })
  })

  const getHeaderTitle = (): string => {
    if (isReply) {
      return t('secureMessaging.reply')
    } else if (isEditDraft) {
      return t('secureMessaging.drafts.edit')
    } else {
      return t('secureMessaging.composeMessage.compose')
    }
  }

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const resetAlerts = () => {
    dispatch(resetSendMessageFailed())
    dispatch(resetSaveDraftComplete())
    dispatch(resetSaveDraftFailed())
    dispatch(resetHasLoadedRecipients())
  }

  const goToDrafts = (draftSaved: boolean): void =>
    navigation.navigate('FolderMessages', {
      folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
      folderName: FolderNameTypeConstants.drafts,
      draftSaved,
    })

  const onSaveDraft = (): void => {
    if (!isFormValid) {
      navigation.navigate('ComposeMessage', { saveDraftConfirmFailed: true })
    } else {
      dispatch(saveDraft(messageData, draftMessageID, !!replyToMessageID, replyToMessageID, true))
      dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.FOLDERS))
      resetAlerts()

      if (isEditDraft) {
        goToDrafts(true)
      } else {
        navigation.navigate('SecureMessaging')
        goToDrafts(true)
      }
    }
  }

  const onCancel = (): void => {
    resetAlerts()
    if (isReply && replyToMessageID) {
      navigation.navigate('ViewMessageScreen', { messageID: replyToMessageID })
    } else if (isEditDraft) {
      goToDrafts(false)
    } else {
      navigation.navigate('SecureMessaging')
    }
  }

  return (
    <VAScrollView {...testIdProps('Compose Message Cancel Confirmation: compose-message-cancel-confirmation-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <ConfirmationAlert
          title={t('secureMessaging.composeMessage.cancel.saveDraftQuestion')}
          text={t('secureMessaging.composeMessage.cancel.saveDraftDescription')}
          background="noCardBackground"
          border="informational"
          confirmLabel={t('secureMessaging.composeMessage.cancel.saveDraft')}
          confirmA11y={t('secureMessaging.composeMessage.cancel.saveDraftA11y')}
          confirmOnPress={onSaveDraft}
          button1type={ButtonTypesConstants.buttonSecondary}
          cancelA11y={t('secureMessaging.composeMessage.cancel.discardA11y')}
          cancelLabel={t('secureMessaging.composeMessage.cancel.discard')}
          button2type={ButtonTypesConstants.buttonPrimary}
          cancelOnPress={onCancel}
        />
      </Box>
    </VAScrollView>
  )
}
export default ComposeCancelConfirmation

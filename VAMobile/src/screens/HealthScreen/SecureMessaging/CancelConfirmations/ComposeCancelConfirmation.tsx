import { BackButton, Box, CrisisLineCta, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DRAFTS_FOLDER_ID, FolderNameTypeConstants } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingTabTypesConstants } from 'store/api/types'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { resetHasLoadedRecipients, resetSaveDraftComplete, resetSaveDraftFailed, resetSendMessageFailed, updateSecureMessagingTab } from 'store/actions'
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
  const { isEditingDraft } = route?.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} />
      ),
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const confirmCancel = (): void => {
    dispatch(resetSendMessageFailed())
    dispatch(resetSaveDraftComplete())
    dispatch(resetSaveDraftFailed())
    dispatch(resetHasLoadedRecipients())
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))

    if (isEditingDraft) {
      navigateTo('FolderMessages', { folderID: DRAFTS_FOLDER_ID, folderName: FolderNameTypeConstants.drafts })()
    } else {
      navigateTo('SecureMessaging')()
    }
  }

  const confirmLabel = isEditingDraft ? t('secureMessaging.composeMessage.cancel.goToDrafts') : t('secureMessaging.composeMessage.cancel.goToInbox')
  const confirmA11y = isEditingDraft ? t('secureMessaging.composeMessage.cancel.goToDraftsA11y') : t('secureMessaging.composeMessage.cancel.goToInboxA11y')

  return (
    <VAScrollView {...testIdProps('Compose Message Cancel Confirmation: compose-message-cancel-confirmation-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <ConfirmationAlert
          title={t('secureMessaging.composeMessage.cancel.cancelQuestion')}
          text={t('secureMessaging.composeMessage.cancel.ifYouCancel')}
          background="noCardBackground"
          border="warning"
          confirmLabel={confirmLabel}
          confirmA11y={confirmA11y}
          confirmOnPress={confirmCancel}
          cancelA11y={t('secureMessaging.sendConfirmation.editingButton.a11y')}
          cancelLabel={t('secureMessaging.sendConfirmation.editingButton')}
          cancelOnPress={navigation.goBack}
        />
      </Box>
    </VAScrollView>
  )
}
export default ComposeCancelConfirmation

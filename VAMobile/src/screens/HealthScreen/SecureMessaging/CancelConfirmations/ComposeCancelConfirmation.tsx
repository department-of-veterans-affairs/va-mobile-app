import { BackButton, Box, CrisisLineCta, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingSystemFolderIdConstants, SecureMessagingTabTypesConstants } from 'store/api/types'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { resetHasLoadedRecipients, resetSaveDraftComplete, resetSaveDraftFailed, resetSendMessageFailed, saveDraft, updateSecureMessagingTab } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useDispatch } from 'react-redux'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ConfirmationAlert from 'components/ConfirmationAlert'
import React, { FC, ReactNode, useEffect, useState } from 'react'

type ComposeCancelConfirmationProps = StackScreenProps<HealthStackParamList, 'ComposeCancelConfirmation'>

const ComposeCancelConfirmation: FC<ComposeCancelConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { messageData, draftMessageID } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} />
      ),
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const resetAlerts = () => {
    dispatch(resetSendMessageFailed())
    dispatch(resetSaveDraftComplete())
    dispatch(resetSaveDraftFailed())
    dispatch(resetHasLoadedRecipients())
  }

  const onSaveDraft = (): void => {
    dispatch(saveDraft(messageData, draftMessageID))
    resetAlerts()
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.FOLDERS))
    navigateTo('SecureMessaging', { goToDrafts: true })()
  }

  const onGoToInbox = (): void => {
    resetAlerts()
    navigateTo('SecureMessaging')()
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
          cancelA11y={t('secureMessaging.composeMessage.cancel.discardA11y')}
          cancelLabel={t('secureMessaging.composeMessage.cancel.discard')}
          cancelOnPress={onGoToInbox}
        />
      </Box>
    </VAScrollView>
  )
}
export default ComposeCancelConfirmation

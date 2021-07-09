import { BackButton, Box, CrisisLineCta, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
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

const ComposeCancelConfirmation: FC<ComposeCancelConfirmationProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} />
      ),
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const onGoToInbox = (): void => {
    dispatch(resetSendMessageFailed())
    dispatch(resetSaveDraftComplete())
    dispatch(resetSaveDraftFailed())
    dispatch(resetHasLoadedRecipients())
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
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
          confirmOnPress={onGoToInbox}
          cancelA11y={t('secureMessaging.composeMessage.cancel.discardA11y')}
          cancelLabel={t('secureMessaging.composeMessage.cancel.discard')}
          cancelOnPress={onGoToInbox}
        />
      </Box>
    </VAScrollView>
  )
}
export default ComposeCancelConfirmation

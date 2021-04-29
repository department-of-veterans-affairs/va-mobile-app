import { AlertBox, BackButton, Box, ButtonTypesConstants, CrisisLineCta, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingTabTypesConstants } from 'store/api/types'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { updateSecureMessagingTab } from 'store/actions'
import { useDispatch } from 'react-redux'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
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
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const onGoToInbox = (): void => {
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
    navigateTo('SecureMessaging')()
  }

  return (
    <VAScrollView {...testIdProps('Compose Message Cancel Confirmation: compose-message-cancel-confirmation-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <AlertBox
          title={t('secureMessaging.composeMessage.cancel.cancelQuestion')}
          text={t('secureMessaging.composeMessage.cancel.ifYouCancel')}
          background="noCardBackground"
          border="warning">
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VAButton
              onPress={onGoToInbox}
              label={t('secureMessaging.composeMessage.cancel.goToInbox')}
              a11yHint={t('secureMessaging.composeMessage.cancel.goToInboxA11y')}
              buttonType={ButtonTypesConstants.buttonPrimary}
            />
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VAButton
                onPress={navigation.goBack}
                label={t('secureMessaging.sendConfirmation.editingButton')}
                a11yHint={t('secureMessaging.sendConfirmation.editingButton.a11y')}
                buttonType={ButtonTypesConstants.buttonSecondary}
              />
            </Box>
          </Box>
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}
export default ComposeCancelConfirmation

import React, { FC, ReactNode, useEffect } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'

import { BackButton, Box, CrisisLineCta, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ConfirmationAlert from 'components/ConfirmationAlert'

type SendConfirmationProps = StackScreenProps<HealthStackParamList, 'SendConfirmation'>

const SendConfirmation: FC<SendConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const { originHeader } = route.params
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
      headerTitle: originHeader,
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  // TODO: Later PR will handle routing action on clicking 'Send' button
  const onSend = () => {}

  return (
    <VAScrollView {...testIdProps('Send Confirmation: Send-message-confirmation-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <ConfirmationAlert
          title={t('secureMessaging.sendConfirmation.question')}
          text={t('secureMessaging.sendConfirmation.areYouSure')}
          background="noCardBackground"
          border="warning"
          confirmLabel={t('secureMessaging.sendConfirmation.sendButton')}
          cancelLabel={t('secureMessaging.sendConfirmation.editingButton')}
          confirmA11y={t('secureMessaging.sendConfirmation.sendButton.a11y')}
          cancelA11y={t('secureMessaging.sendConfirmation.editingButton.a11y')}
          confirmOnPress={onSend}
          cancelOnPress={navigation.goBack}
        />
      </Box>
    </VAScrollView>
  )
}

export default SendConfirmation

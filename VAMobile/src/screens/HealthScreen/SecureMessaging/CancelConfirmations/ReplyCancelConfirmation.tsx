import { BackButton, Box, CrisisLineCta, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ConfirmationAlert from 'components/ConfirmationAlert'
import React, { FC, ReactNode, useEffect } from 'react'

type ReplyCancelConfirmationProps = StackScreenProps<HealthStackParamList, 'ReplyCancelConfirmation'>

const ReplyCancelConfirmation: FC<ReplyCancelConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { messageID } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const onGoToThread = navigateTo('ViewMessageScreen', { messageID })

  return (
    <VAScrollView {...testIdProps('Reply Message Cancel Confirmation: reply-message-cancel-confirmation-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <ConfirmationAlert
          title={t('secureMessaging.reply.cancel.cancelQuestion')}
          text={t('secureMessaging.reply.cancel.ifYouCancel')}
          background="noCardBackground"
          border="warning"
          confirmLabel={t('secureMessaging.reply.cancel.goToMessage')}
          confirmA11y={t('secureMessaging.reply.cancel.goToMessageA11y')}
          confirmOnPress={onGoToThread}
          cancelLabel={t('secureMessaging.sendConfirmation.editingButton')}
          cancelA11y={t('secureMessaging.sendConfirmation.editingButton.a11y')}
          cancelOnPress={navigation.goBack}
        />
      </Box>
    </VAScrollView>
  )
}
export default ReplyCancelConfirmation

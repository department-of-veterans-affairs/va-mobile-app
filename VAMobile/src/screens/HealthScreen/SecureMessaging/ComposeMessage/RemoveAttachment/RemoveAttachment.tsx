import { AlertBox, BackButton, Box, ButtonTypesConstants, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { FormHeaderTypeConstants } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import React, { FC, ReactNode, useEffect } from 'react'

type RemoveAttachmentProps = StackScreenProps<HealthStackParamList, 'RemoveAttachment'>

const RemoveAttachment: FC<RemoveAttachmentProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { origin, attachmentFileToRemove, messageID } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
    })
  })

  const onRemove = (): void => {
    if (origin === FormHeaderTypeConstants.compose) {
      navigateTo('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove })()
    } else if (origin === FormHeaderTypeConstants.reply) {
      navigateTo('ReplyMessage', { messageId: messageID, attachmentFileToAdd: {}, attachmentFileToRemove })()
    } else {
      navigateTo('EditDraft', { messageId: messageID, attachmentFileToAdd: {}, attachmentFileToRemove })()
    }
  }

  return (
    <VAScrollView {...testIdProps('Attachments: Remove-attachment-confirmation-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <AlertBox
          title={t('secureMessaging.attachments.removeAttachmentQuestion')}
          text={t('secureMessaging.attachments.removeAttachmentAreYouSure')}
          background="noCardBackground"
          border="warning">
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VAButton
              onPress={onRemove}
              label={t('secureMessaging.attachments.removeAttachment')}
              a11yHint={t('secureMessaging.attachments.removeAttachmentFromThisMessage')}
              buttonType={ButtonTypesConstants.buttonPrimary}
            />
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VAButton
                onPress={() => navigation.goBack()}
                label={t('secureMessaging.attachments.noGoBackToMessage')}
                a11yHint={t('secureMessaging.attachments.goBack')}
                buttonType={ButtonTypesConstants.buttonSecondary}
              />
            </Box>
          </Box>
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default RemoveAttachment

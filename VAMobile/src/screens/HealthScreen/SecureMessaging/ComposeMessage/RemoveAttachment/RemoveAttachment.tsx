import React, { FC, ReactNode, useEffect } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'

import { AlertBox, BackButton, Box, ButtonTypesConstants, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { FormHeaderTypeConstants } from 'constants/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type RemoveAttachmentProps = StackScreenProps<HealthStackParamList, 'RemoveAttachment'>

const RemoveAttachment: FC<RemoveAttachmentProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { origin, attachmentFileToRemove, messageID } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const onRemove = (): void => {
    if (origin === FormHeaderTypeConstants.compose) {
      navigateTo('ComposeMessage', { attachmentFileToAdd: {}, attachmentFileToRemove })()
    } else {
      navigateTo('ReplyMessage', { messageId: messageID, attachmentFileToAdd: {}, attachmentFileToRemove })()
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

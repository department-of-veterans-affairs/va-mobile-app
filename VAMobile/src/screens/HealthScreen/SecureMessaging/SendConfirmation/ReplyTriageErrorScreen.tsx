import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect } from 'react'

import { AlertBox, BackButton, Box, ButtonTypesConstants, CrisisLineCta, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingTabTypesConstants } from 'store/api/types'
import { testIdProps } from 'utils/accessibility'
import { updateSecureMessagingTab } from 'store/slices'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'

type ReplyTriageErrorScreenProps = StackScreenProps<HealthStackParamList, 'ReplyTriageErrorScreen'>

const ReplyTriageErrorScreen: FC<ReplyTriageErrorScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()

  const onGoToInbox = (): void => {
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
    navigateTo('SecureMessaging')()
  }

  useEffect(() => {
    // Set canGoBack to false so Back button is hidden
    navigation.setOptions({
      headerLeft: (): ReactNode => <BackButton onPress={undefined} canGoBack={false} label={BackButtonLabelConstants.back} showCarat={true} />,
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  return (
    <VAScrollView {...testIdProps('Reply Triage Error: reply-triage-error-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <AlertBox title={t('secureMessaging.sendError.title')} text={t('secureMessaging.reply.error.youCantSend')} border={'error'}>
          <Box my={theme.dimensions.standardMarginBetween}>
            <TextView accessible={true} accessibilityLabel={t('secureMessaging.reply.error.ifYouThinkA11y')}>
              {t('secureMessaging.reply.error.ifYouThink')}
            </TextView>
          </Box>
          <VAButton
            onPress={onGoToInbox}
            label={t('secureMessaging.goToInbox')}
            a11yHint={t('secureMessaging.goToInbox.a11yHint')}
            buttonType={ButtonTypesConstants.buttonPrimary}
          />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}
export default ReplyTriageErrorScreen

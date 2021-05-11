import { AlertBox, BackButton, Box, ButtonTypesConstants, CrisisLineCta, TextView, VAButton, VAScrollView } from 'components'
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

type SuccessfulSendScreenProps = StackScreenProps<HealthStackParamList, 'SuccessfulSendScreen'>

const SuccessfulSendScreen: FC<SuccessfulSendScreenProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()

  const onGoToInbox = (): void => {
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
    navigation.navigate('SecureMessaging')
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={onGoToInbox} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} />
      ),
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  return (
    <VAScrollView {...testIdProps('Successful Send Confirmation: successful-send-confirmation-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <AlertBox
          border={'success'}
          background={'noCardBackground'}
          title={t('secureMessaging.sent.messageSent')}
          text={t('secureMessaging.sent.threeBusinessDays')}
          textA11yLabel={t('secureMessaging.sent.threeBusinessDays.a11y')}>
          <Box {...testIdProps(t('secureMessaging.composeMessage.important'))} accessibilityRole={'header'} accessible={true}>
            <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
              {t('secureMessaging.composeMessage.important')}
            </TextView>
          </Box>
          <Box {...testIdProps(t('secureMessaging.sent.pleaseCall.a11y'))} accessible={true} my={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBody">{t('secureMessaging.composeMessage.pleaseCallHealthProvider')}</TextView>
          </Box>
          <VAButton
            onPress={onGoToInbox}
            label={t('secureMessaging.goToInbox')}
            a11yHint={t('secureMessaging.goToInbox.a11yHint.sent')}
            buttonType={ButtonTypesConstants.buttonPrimary}
          />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}
export default SuccessfulSendScreen

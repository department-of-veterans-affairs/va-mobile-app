import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, CategoryLanding, LargeNavButton } from 'components'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from './PaymentsStackScreens'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import DirectDepositScreen from './DirectDepositScreen'
import HowToUpdateDirectDepositScreen from './DirectDepositScreen/HowToUpdateDirectDepositScreen'
import PaymentDetailsScreen from './PaymentHistory/PaymentDetailsScreen/PaymentDetailsScreen'
import PaymentHistoryScreen from './PaymentHistory/PaymentHistoryScreen'

type PaymentsScreenProps = StackScreenProps<PaymentsStackParamList, 'Payments'>

const PaymentsScreen: FC<PaymentsScreenProps> = () => {
  const { data: userAuthorizedServices } = useAuthorizedServices()

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const onPayments = navigateTo('PaymentHistory')
  const onDirectDeposit = userAuthorizedServices?.directDepositBenefitsUpdate ? navigateTo('DirectDeposit') : navigateTo('HowToUpdateDirectDeposit')

  return (
    <CategoryLanding title={t('payments.title')}>
      <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('vaPaymentHistory')}
          onPress={onPayments}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        {userAuthorizedServices?.directDepositBenefits && (
          <LargeNavButton
            title={t('directDeposit.information')}
            onPress={onDirectDeposit}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
          />
        )}
      </Box>
    </CategoryLanding>
  )
}

type PaymentsStackScreenProps = Record<string, unknown>

const PaymentsScreenStack = createStackNavigator()

/**
 * Stack screen for the Payments tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const PaymentsStackScreen: FC<PaymentsStackScreenProps> = () => {
  const screenOptions = {
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }
  return (
    <PaymentsScreenStack.Navigator
      screenOptions={screenOptions}
      screenListeners={{
        transitionStart: (e) => {
          if (e.data.closing) {
            CloseSnackbarOnNavigation(e.target)
          }
        },
        blur: (e) => {
          CloseSnackbarOnNavigation(e.target)
        },
      }}>
      <PaymentsScreenStack.Screen name="Payments" component={PaymentsScreen} options={{ headerShown: false }} />
      <PaymentsScreenStack.Screen name="PaymentDetails" component={PaymentDetailsScreen} options={{ headerShown: false }} />
      <PaymentsScreenStack.Screen name="DirectDeposit" component={DirectDepositScreen} options={{ headerShown: false }} />
      <PaymentsScreenStack.Screen name="HowToUpdateDirectDeposit" component={HowToUpdateDirectDepositScreen} options={{ headerShown: false }} />
      <PaymentsScreenStack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ headerShown: false }} />
    </PaymentsScreenStack.Navigator>
  )
}

export default PaymentsStackScreen

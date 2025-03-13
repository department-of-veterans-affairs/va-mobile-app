import React from 'react'
import { useTranslation } from 'react-i18next'

import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { Box, CategoryLanding, LargeNavButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import DirectDepositScreen from './DirectDepositScreen'
import HowToUpdateDirectDepositScreen from './DirectDepositScreen/HowToUpdateDirectDepositScreen'
import PaymentDetailsScreen from './PaymentHistory/PaymentDetailsScreen/PaymentDetailsScreen'
import PaymentHistoryScreen from './PaymentHistory/PaymentHistoryScreen'
import { PaymentsStackParamList } from './PaymentsStackScreens'

type PaymentsScreenProps = StackScreenProps<PaymentsStackParamList, 'Payments'>

function PaymentsScreen({}: PaymentsScreenProps) {
  const { data: userAuthorizedServices } = useAuthorizedServices({ enabled: screenContentAllowed('WG_Payments') })

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const onPayments = () => {
    navigateTo('PaymentHistory')
  }
  const onDirectDeposit = () => {
    if (userAuthorizedServices?.directDepositBenefitsUpdate) {
      navigateTo('DirectDeposit')
    } else if (!userAuthorizedServices?.directDepositBenefitsUpdate) {
      navigateTo('HowToUpdateDirectDeposit')
    }
  }

  return (
    <CategoryLanding title={t('payments.title')} testID="paymentsID">
      <Box mb={theme.dimensions.standardMarginBetween}>
        <LargeNavButton title={t('vaPaymentHistory')} onPress={onPayments} testID="toPaymentHistoryID" />
        {userAuthorizedServices?.directDepositBenefits && (
          <LargeNavButton title={t('directDeposit.information')} onPress={onDirectDeposit} testID="toDirectDepositID" />
        )}
      </Box>
    </CategoryLanding>
  )
}

type PaymentsStackScreenProps = Record<string, unknown>

const PaymentsScreenStack = createStackNavigator<PaymentsStackParamList>()

/**
 * Stack screen for the Payments tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
function PaymentsStackScreen({}: PaymentsStackScreenProps) {
  const snackbar = useSnackbar()
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
            snackbar.hide()
          }
        },
        blur: () => {
          snackbar.hide()
        },
      }}>
      <PaymentsScreenStack.Screen name="Payments" component={PaymentsScreen} options={{ headerShown: false }} />
      <PaymentsScreenStack.Screen
        name="PaymentDetails"
        component={PaymentDetailsScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        name="DirectDeposit"
        component={DirectDepositScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        name="HowToUpdateDirectDeposit"
        component={HowToUpdateDirectDepositScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
    </PaymentsScreenStack.Navigator>
  )
}

export default PaymentsStackScreen

import React from 'react'
import { useTranslation } from 'react-i18next'

import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { Box, CategoryLanding, LargeNavButton, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import CopaysScreen from 'screens/PaymentsScreen/Copays'
import ChargeDetails from 'screens/PaymentsScreen/Copays/ChargeDetails/ChargeDetailsScreen'
import CopayDetails from 'screens/PaymentsScreen/Copays/CopayDetails/CopayDetailsScreen'
import DisputeCopay from 'screens/PaymentsScreen/Copays/DisputeCopay/DisputeCopayScreen'
import PayBill from 'screens/PaymentsScreen/Copays/PayBill/PayBillScreen'
import CopayRequestHelp from 'screens/PaymentsScreen/Copays/RequestHelp/CopayRequestHelpScreen'
import DebtsScreen from 'screens/PaymentsScreen/Debts'
import DebtDetails from 'screens/PaymentsScreen/Debts/DebtDetails/DebtDetailsScreen'
import DisputeDebt from 'screens/PaymentsScreen/Debts/DisputeDebt/DisputeDebtScreen'
import PayDebt from 'screens/PaymentsScreen/Debts/PayDebt/PayDebtScreen'
import DebtRequestHelp from 'screens/PaymentsScreen/Debts/RequestHelp/DebtRequestHelpScreen'
import TransactionDetails from 'screens/PaymentsScreen/Debts/TransactionDetails/TransactionDetailsScreen'
import DirectDepositScreen from 'screens/PaymentsScreen/DirectDepositScreen'
import HowToUpdateDirectDepositScreen from 'screens/PaymentsScreen/DirectDepositScreen/HowToUpdateDirectDepositScreen'
import PaymentDetailsScreen from 'screens/PaymentsScreen/PaymentHistory/PaymentDetailsScreen/PaymentDetailsScreen'
import PaymentHistoryScreen from 'screens/PaymentsScreen/PaymentHistory/PaymentHistoryScreen'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { numberToUSDollars } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

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
      {featureEnabled('overpayCopay') && (
        <TextView
          mx={theme.dimensions.condensedMarginBetween}
          mb={theme.dimensions.standardMarginBetween}
          variant={'MobileBodyBold'}
          accessibilityRole="header">
          {t('payments.toYou')}
        </TextView>
      )}
      <Box mb={theme.dimensions.standardMarginBetween}>
        <LargeNavButton title={t('vaPaymentHistory')} onPress={onPayments} testID="toPaymentHistoryID" />
        {userAuthorizedServices?.directDepositBenefits && (
          <LargeNavButton title={t('directDeposit.information')} onPress={onDirectDeposit} testID="toDirectDepositID" />
        )}
      </Box>
      {featureEnabled('overpayCopay') && (
        <>
          <TextView
            mx={theme.dimensions.condensedMarginBetween}
            mb={theme.dimensions.standardMarginBetween}
            variant={'MobileBodyBold'}
            accessibilityRole="header">
            {t('payments.yourDebtAndBills')}
          </TextView>
          <LargeNavButton
            title={t('debts.title')}
            onPress={() => navigateTo('Debts')}
            subText={t('debts.activityButton.subText', {
              amount: numberToUSDollars(0),
              count: 0,
            })}
          />
          <LargeNavButton
            title={t('copays.title')}
            onPress={() => navigateTo('Copays')}
            subText={t('copays.activityButton.subText', {
              amount: numberToUSDollars(0),
              count: 0,
            })}
          />
        </>
      )}
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
      <PaymentsScreenStack.Screen name="Copays" component={CopaysScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <PaymentsScreenStack.Screen
        key={'ChargeDetails'}
        name="ChargeDetails"
        component={ChargeDetails}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        key={'CopayDetails'}
        name="CopayDetails"
        component={CopayDetails}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        key={'CopayRequestHelp'}
        name="CopayRequestHelp"
        component={CopayRequestHelp}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        key={'DisputeCopay'}
        name="DisputeCopay"
        component={DisputeCopay}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        key={'PayBill'}
        name="PayBill"
        component={PayBill}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen name="Debts" component={DebtsScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <PaymentsScreenStack.Screen
        key={'DebtDetails'}
        name="DebtDetails"
        component={DebtDetails}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        key={'DebtRequestHelp'}
        name="DebtRequestHelp"
        component={DebtRequestHelp}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        key={'TransactionDetails'}
        name="TransactionDetails"
        component={TransactionDetails}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        key={'DisputeDebt'}
        name="DisputeDebt"
        component={DisputeDebt}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <PaymentsScreenStack.Screen
        key={'PayDebt'}
        name="PayDebt"
        component={PayDebt}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
    </PaymentsScreenStack.Navigator>
  )
}

export default PaymentsStackScreen

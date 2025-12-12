import React from 'react'
import { useTranslation } from 'react-i18next'

import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDebts } from 'api/debts'
import { useMedicalCopays } from 'api/medicalCopays'
import { Box, CategoryLanding, LargeNavButton, LinkWithAnalytics, TextView } from 'components'
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
import DirectDepositScreen from 'screens/PaymentsScreen/DirectDepositScreen'
import HowToUpdateDirectDepositScreen from 'screens/PaymentsScreen/DirectDepositScreen/HowToUpdateDirectDepositScreen'
import NoticeOfRights from 'screens/PaymentsScreen/NoticeOfRights/NoticeOfRightsScreen'
import PaymentDetailsScreen from 'screens/PaymentsScreen/PaymentHistory/PaymentDetailsScreen/PaymentDetailsScreen'
import PaymentHistoryScreen from 'screens/PaymentsScreen/PaymentHistory/PaymentHistoryScreen'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { numberToUSDollars } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { navigateToTravelClaims } from 'utils/travelPay'
import { screenContentAllowed } from 'utils/waygateConfig'

type PaymentsScreenProps = StackScreenProps<PaymentsStackParamList, 'Payments'>

function PaymentsScreen({}: PaymentsScreenProps) {
  const { data: userAuthorizedServices } = useAuthorizedServices({ enabled: screenContentAllowed('WG_Payments') })

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const { summary: copaysSummary, isLoading: copaysLoading, error: copaysError } = useMedicalCopays()

  const { summary: debtsSummary, isLoading: debtsLoading, error: debtsError } = useDebts()

  const copaysSubText =
    !copaysLoading && !copaysError && copaysSummary.count > 0 && copaysSummary.amountDue > 0
      ? t('copays.amountDueForBills', {
          amount: numberToUSDollars(copaysSummary.amountDue),
          count: copaysSummary.count,
        })
      : undefined

  const debtsSubText =
    !debtsLoading && !debtsError && debtsSummary.count > 0 && debtsSummary.amountDue > 0
      ? t('debts.activityButton.subText', {
          amount: numberToUSDollars(debtsSummary.amountDue),
          count: debtsSummary.count,
        })
      : undefined

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
      <Box>
        <LargeNavButton title={t('vaPaymentHistory')} onPress={onPayments} testID="toPaymentHistoryID" />
        {userAuthorizedServices?.directDepositBenefits && (
          <LargeNavButton title={t('directDeposit.information')} onPress={onDirectDeposit} testID="toDirectDepositID" />
        )}
      </Box>
      {featureEnabled('overpayCopay') && (
        <>
          <TextView
            mt={theme.dimensions.standardMarginBetween}
            mx={theme.dimensions.condensedMarginBetween}
            mb={theme.dimensions.standardMarginBetween}
            variant={'MobileBodyBold'}
            accessibilityRole="header">
            {t('payments.yourDebtAndBills')}
          </TextView>
          <LargeNavButton
            title={t('debts.title')}
            onPress={() => navigateTo('Debts')}
            subText={debtsSubText}
            showLoading={debtsLoading}
          />
          <LargeNavButton
            title={t('copays.title')}
            onPress={() => navigateTo('Copays')}
            subText={copaysSubText}
            showLoading={copaysLoading}
          />
        </>
      )}
      {featureEnabled('travelPayStatusList') && (
        <Box ml={theme.dimensions.gutter}>
          <LinkWithAnalytics
            type="custom"
            text={t('travelPay.claims.viewYourClaims')}
            testID="toTravelPayClaimsLinkID"
            onPress={() => navigateToTravelClaims(navigateTo)}
          />
        </Box>
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
      <PaymentsScreenStack.Screen
        key={'NoticeOfRights'}
        name="NoticeOfRights"
        component={NoticeOfRights}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
    </PaymentsScreenStack.Navigator>
  )
}

export default PaymentsStackScreen

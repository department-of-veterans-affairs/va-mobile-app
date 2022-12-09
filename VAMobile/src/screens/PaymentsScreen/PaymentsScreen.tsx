import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { AuthorizedServicesState } from 'store/slices'
import { Box, FocusedNavHeaderText, LargeNavButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from './PaymentsStackScreens'
import { RootState } from 'store'
import { useHeaderStyles, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type PaymentsScreenProps = StackScreenProps<PaymentsStackParamList, 'Payments'>

const PaymentsScreen: FC<PaymentsScreenProps> = ({ navigation }) => {
  const { directDepositBenefits, directDepositBenefitsUpdate } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.PAYMENTS)
  const navigateTo = useRouteNavigation()

  const onPayments = navigateTo('PaymentHistory')
  const onDirectDeposit = directDepositBenefitsUpdate ? navigateTo('DirectDeposit') : navigateTo('HowToUpdateDirectDeposit')

  return (
    <VAScrollView>
      <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('vaPaymentHistory')}
          onPress={onPayments}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        {directDepositBenefits && (
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
    </VAScrollView>
  )
}

type PaymentsStackScreenProps = Record<string, unknown>

const PaymentsScreenStack = createStackNavigator()

/**
 * Stack screen for the Profile tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const PaymentsStackScreen: FC<PaymentsStackScreenProps> = () => {
  const { t } = useTranslation(NAMESPACE.PAYMENTS)
  const headerStyles = useHeaderStyles()

  return (
    <PaymentsScreenStack.Navigator screenOptions={headerStyles}>
      <PaymentsScreenStack.Screen name="Payments" component={PaymentsScreen} options={{ title: t('title') }} />
    </PaymentsScreenStack.Navigator>
  )
}

export default PaymentsStackScreen

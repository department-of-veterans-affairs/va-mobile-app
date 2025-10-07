import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import ResolveDebtButton from 'screens/PaymentsScreen/Debts/ResolveDebt/ResolveDebtButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type DebtsScreenProps = StackScreenProps<PaymentsStackParamList, 'Debts'>

function DebtsScreen({ navigation }: DebtsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const helpIconProps: IconProps = {
    name: 'HelpOutline',
    fill: theme.colors.icon.active,
  }

  const headerButton = {
    label: t('help'),
    icon: helpIconProps,
    onPress: () => {
      navigateTo('DebtHelp')
    },
    testID: 'debtHelpID',
  }

  return (
    <FeatureLandingTemplate
      headerButton={headerButton}
      backLabel={t('payments.title')}
      backLabelOnPress={navigation.goBack}
      title={t('debts.title')}
      testID="debtsTestID"
      backLabelTestID="debtsBackTestID">
      {/* TODO: Temporary code to navigate to other screens */}
      <Box mx={theme.dimensions.cardPadding} my={theme.dimensions.buttonPadding}>
        <Button
          label={t('debts.reviewDetails')}
          onPress={() => {
            navigation.navigate
            navigateTo('DebtDetails', {
              debtRecord: null,
            })
          }}
        />
      </Box>
      <ResolveDebtButton />
    </FeatureLandingTemplate>
  )
}

export default DebtsScreen

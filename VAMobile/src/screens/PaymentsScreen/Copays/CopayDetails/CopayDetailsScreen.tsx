import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, FeatureLandingTemplate } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import ResolveBillButton from 'screens/PaymentsScreen/Copays/ResolveBill/ResolveBillButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type CopayDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'CopayDetails'>

function CopayDetailsScreen({ navigation }: CopayDetailsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  return (
    <FeatureLandingTemplate
      backLabel={t('copays.title')}
      backLabelOnPress={navigation.goBack}
      title={t('copays.details.title')}
      testID="copayDetailsTestID"
      backLabelTestID="copayDetailsBackTestID">
      {/* TODO: Temporary code to navigate to other screens */}
      <Box mx={theme.dimensions.cardPadding} my={theme.dimensions.buttonPadding}>
        <Button
          label={t('copays.chargeDetails.title')}
          onPress={() => {
            navigateTo('ChargeDetails', {
              copayDetail: null,
            })
          }}
        />
      </Box>
      <ResolveBillButton />
    </FeatureLandingTemplate>
  )
}

export default CopayDetailsScreen

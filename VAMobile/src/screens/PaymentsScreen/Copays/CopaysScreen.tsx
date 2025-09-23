import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { useMedicalCopays } from 'api/medicalCopays'
import { Box, FeatureLandingTemplate } from 'components'
import EmptyStateMessage from 'components/EmptyStateMessage'
import { NAMESPACE } from 'constants/namespaces'
import ResolveBillButton from 'screens/PaymentsScreen/Copays/ResolveBill/ResolveBillButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type CopaysScreenProps = StackScreenProps<PaymentsStackParamList, 'Copays'>

function CopaysScreen({ navigation }: CopaysScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const { summary, isLoading, error } = useMedicalCopays()

  const hasError = !!error
  const isEmpty = (summary?.count ?? 0) === 0

  const showEmpty = !isLoading && !hasError && isEmpty

  const helpIconProps: IconProps = {
    name: 'HelpOutline',
    fill: theme.colors.icon.active,
  }

  const headerButton = {
    label: t('help'),
    icon: helpIconProps,
    onPress: () => {
      navigateTo('CopayHelp')
    },
    testID: 'copayHelpID',
  }

  return (
    <FeatureLandingTemplate
      headerButton={headerButton}
      backLabel={t('payments.title')}
      backLabelOnPress={navigation.goBack}
      title={t('copays.title')}
      testID="copaysTestID"
      backLabelTestID="copaysBackTestID">
      {/* TODO: Temporary code to navigate to other screens */}
      {showEmpty ? (
        <EmptyStateMessage title={t('copays.empty.title')} body={t('copays.empty.body')} phone={t('8664001238')} />
      ) : (
        <>
          <Box mx={theme.dimensions.cardPadding} my={theme.dimensions.buttonPadding}>
            <Button
              label={t('copays.reviewDetails')}
              onPress={() => navigateTo('CopayDetails', { copayRecord: null })}
            />
          </Box>
          <ResolveBillButton />
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default CopaysScreen

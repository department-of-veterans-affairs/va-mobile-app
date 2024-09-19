import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { DateTime } from 'luxon'

import { Box, LargePanel, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useTheme } from 'utils/hooks'
import { getStatusDefinitionTextForRefillStatus } from 'utils/prescriptions'

import { HealthStackParamList } from '../../HealthStackScreens'

type StatusDefinitionProps = StackScreenProps<HealthStackParamList, 'StatusDefinition'>

function StatusDefinition({ navigation, route }: StatusDefinitionProps) {
  const { display, value } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { text, a11yLabel } = getStatusDefinitionTextForRefillStatus(value, t)
  const timeOpened = DateTime.now().toMillis()

  useBeforeNavBackListener(navigation, () => {
    const timeClosed = DateTime.now().toMillis()
    logAnalyticsEvent(Events.vama_rx_status(display, timeClosed - timeOpened))
  })

  return (
    <LargePanel title={t('statusDefinition')} rightButtonText={t('close')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
        <TextView variant="MobileBodyBold">{display}</TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.condensedMarginBetween} accessibilityLabel={a11yLabel}>
          {text}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default StatusDefinition

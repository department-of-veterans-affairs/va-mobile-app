import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'

import { Box, LargePanel, TextView } from 'components'
import { DateTime } from 'luxon'
import { Events } from 'constants/analytics'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { getStatusDefinitionTextForRefillStatus } from 'utils/prescriptions'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useTheme } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

type StatusDefinitionProps = StackScreenProps<HealthStackParamList, 'StatusDefinition'>

const StatusDefinition: FC<StatusDefinitionProps> = ({ navigation, route }) => {
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

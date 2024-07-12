import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

import { HealthStackParamList } from '../../HealthStackScreens'

type SessionNotStartedProps = StackScreenProps<HealthStackParamList, 'SessionNotStarted'>

function SessionNotStarted({}: SessionNotStartedProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel title={t('appointmentsHelp')} rightButtonText={t('close')}>
      <Box mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold">{t('appointments.sessionNotStarted.title')}</TextView>
        <TextView mt={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {t('appointments.joinVideoConnect')}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default SessionNotStarted

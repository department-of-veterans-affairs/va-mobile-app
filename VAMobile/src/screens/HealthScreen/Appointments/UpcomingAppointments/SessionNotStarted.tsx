import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, LargePanel, TextView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type SessionNotStartedProps = StackScreenProps<HealthStackParamList, 'SessionNotStarted'>

const SessionNotStarted: FC<SessionNotStartedProps> = () => {
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

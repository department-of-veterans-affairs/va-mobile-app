import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, ClickForActionLink, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

import { HealthStackParamList } from '../HealthStackScreens'

type HealthHelpProps = StackScreenProps<HealthStackParamList, 'HealthHelp'>

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

function HealthHelp({}: HealthHelpProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <LargePanel title={t('healthHelp.title')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" />
        <ClickForActionLink
          displayedText={t('goToMyVAHealth')}
          a11yLabel={t('goToMyVAHealth')}
          linkType={'externalLink'}
          numberOrUrlLink={LINK_URL_GO_TO_PATIENT_PORTAL}
        />
      </Box>
    </LargePanel>
  )
}

export default HealthHelp

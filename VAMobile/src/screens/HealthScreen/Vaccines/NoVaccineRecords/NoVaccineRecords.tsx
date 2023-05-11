import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ClickToCallPhoneNumber, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

const NoVaccineRecords: FC = () => {
  const { t } = useTranslation([NAMESPACE.HEALTH, NAMESPACE.COMMON])
  const theme = useTheme()

  return (
    <VAScrollView>
      <Box mt={theme?.dimensions?.standardMarginBetween}>
        <AlertBox title={t('health:noVaccineRecords.alert.title')} border="informational" text={t('health:noVaccineRecords.alert.text')}>
          <ClickToCallPhoneNumber phone={t('common:8006982411')} displayedText={t('common:8006982411.displayText')} />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default NoVaccineRecords

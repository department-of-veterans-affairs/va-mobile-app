import React, { FC } from 'react'

import { AlertBox, Box, ClickToCallPhoneNumber, VAScrollView } from 'components'

import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

const NoVaccineRecords: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <VAScrollView>
      <Box mt={standardMarginBetween} mx={theme.dimensions.gutter}>
        <AlertBox title={t('noVaccineRecords.alert.title')} border="informational" text={t('noVaccineRecords.alert.text')}>
          <ClickToCallPhoneNumber phone={t('common:8006982411')} displayedText={t('common:8006982411.displayText')} />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default NoVaccineRecords

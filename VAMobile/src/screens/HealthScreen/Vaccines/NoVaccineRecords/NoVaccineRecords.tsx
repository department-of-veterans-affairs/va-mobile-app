import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

const NoVaccineRecords: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <VAScrollView>
      <AlertBox title={t('noVaccineRecords.alert.title')} border="informational" text={t('noVaccineRecords.alert.text.1')}>
        <TextView paragraphSpacing={true} mt={theme.paragraphSpacing.spacing20FontSize} variant="MobileBody">
          {t('noVaccineRecords.alert.text.2')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8006982411')} displayedText={t('8006982411.displayText')} />
      </AlertBox>
    </VAScrollView>
  )
}

export default NoVaccineRecords

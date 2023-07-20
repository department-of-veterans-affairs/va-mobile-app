import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'

const NoVaccineRecords: FC = () => {
  const { t } = useTranslation([NAMESPACE.HEALTH, NAMESPACE.COMMON])

  return (
    <VAScrollView>
      <AlertBox title={t('health:noVaccineRecords.alert.title')} border="informational" text={t('health:noVaccineRecords.alert.text.1')}>
        <TextView paragraphSpacing={true} variant="MobileBody">
          {t('health:noVaccineRecords.alert.text.2')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('common:8006982411')} displayedText={t('common:8006982411.displayText')} />
      </AlertBox>
    </VAScrollView>
  )
}

export default NoVaccineRecords

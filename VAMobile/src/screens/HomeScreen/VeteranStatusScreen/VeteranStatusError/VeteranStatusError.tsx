import React from 'react'
import { useTranslation } from 'react-i18next'

import { AlertWithHaptics, ClickToCallPhoneNumber, LargePanel } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

const VeternStatusError = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <LargePanel
      title={t('veteranStatus.title')}
      rightButtonText={t('close')}
      dividerMarginBypass={true}
      testID="veteranStatusTestID"
      rightButtonTestID="veteranStatusCloseID">
      <AlertWithHaptics
        variant="warning"
        header={t('veteranStatus.error.catchAll.title')}
        headerA11yLabel={a11yLabelVA(t('veteranStatus.error.catchAll.title'))}
        description={t('veteranStatus.error.catchAll.body')}
        descriptionA11yLabel={a11yLabelVA(t('veteranStatus.error.catchAll.body'))}>
        <ClickToCallPhoneNumber
          a11yLabel={a11yLabelID(t('8005389552'))}
          displayedText={displayedTextPhoneNumber(t('8005389552'))}
          phone={t('8005389552')}
        />
      </AlertWithHaptics>
    </LargePanel>
  )
}

export default VeternStatusError

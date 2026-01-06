import React from 'react'
import { useTranslation } from 'react-i18next'

import { AlertWithHaptics, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelMyVA411, a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'

function NoLabsAndTestsRecords() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <VAScrollView testID="NoLabsAndTestsRecords">
      <AlertWithHaptics
        variant="info"
        header={t('labsAndTests.noRecords.alert.title')}
        headerA11yLabel={a11yLabelVA(t('labsAndTests.noRecords.alert.title'))}
        description={
          featureEnabled('mrHide36HrHoldTimes')
            ? t('labsAndTests.noRecords.zeroHoldTimes.text.1')
            : t('labsAndTests.noRecords.alert.text.1')
        }>
        <TextView
          accessible
          paragraphSpacing={true}
          variant="MobileBody"
          accessibilityLabel={a11yLabelMyVA411(t('labsAndTests.noRecords.alert.text.2'))}
          accessibilityHint={t('labsAndTests.noRecords.alert.text.2.hint')}>
          {t('labsAndTests.noRecords.alert.text.2')}
        </TextView>
        <ClickToCallPhoneNumber
          phone={t('8006982411')}
          displayedText={displayedTextPhoneNumber(t('8006982411'))}
          variant={'base'}
        />
      </AlertWithHaptics>
    </VAScrollView>
  )
}

export default NoLabsAndTestsRecords

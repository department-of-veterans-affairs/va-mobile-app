import React from 'react'
import { useTranslation } from 'react-i18next'

import { TextArea, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'

type AppealsIssuesProps = {
  issues: Array<string>
}

function AppealIssues({ issues }: AppealsIssuesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <TextArea {...testIdProps('Your-appeal: Issues-tab-appeal-details-page')}>
      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {t('appealDetails.currentlyOnAppeal')}
      </TextView>
      <VABulletList listOfText={issues} />
    </TextArea>
  )
}

export default AppealIssues

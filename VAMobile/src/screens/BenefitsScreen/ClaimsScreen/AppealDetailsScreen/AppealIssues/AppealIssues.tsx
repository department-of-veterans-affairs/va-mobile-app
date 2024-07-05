import React from 'react'
import { useTranslation } from 'react-i18next'

import { TextArea, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'

type AppealsIssuesProps = {
  issues: Array<string>
}

function AppealIssues({ issues }: AppealsIssuesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <TextArea>
      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {t('appealDetails.currentlyOnAppeal')}
      </TextView>
      <VABulletList listOfText={issues} />
    </TextArea>
  )
}

export default AppealIssues

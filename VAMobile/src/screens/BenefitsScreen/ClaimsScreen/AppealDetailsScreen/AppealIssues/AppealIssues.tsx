import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { TextArea, TextView, VABulletList } from 'components'
import { testIdProps } from 'utils/accessibility'

type AppealsIssuesProps = {
  issues: Array<string>
}

const AppealIssues: FC<AppealsIssuesProps> = ({ issues }) => {
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

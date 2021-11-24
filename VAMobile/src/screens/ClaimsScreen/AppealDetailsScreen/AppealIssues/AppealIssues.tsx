import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { TextArea, TextView, VABulletList } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'

type AppealsIssuesProps = {
  issues: Array<string>
}

const AppealIssues: FC<AppealsIssuesProps> = ({ issues }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)

  return (
    <TextArea {...testIdProps('Your-appeal: Issues-tab-appeal-details-page')}>
      <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
        {t('appealDetails.currentlyOnAppeal')}
      </TextView>
      <VABulletList listOfText={issues} />
    </TextArea>
  )
}

export default AppealIssues

import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { TextArea, TextView, VABulletList } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'

type AppealsDetailProps = {
  issues: Array<string>
}

const AppealDetails: FC<AppealsDetailProps> = ({ issues }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)

  return (
    <TextArea {...testIdProps('Appeals-details-list')}>
      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {t('appealDetails.currentlyOnAppeal')}
      </TextView>
      <VABulletList listOfText={issues} />
    </TextArea>
  )
}

export default AppealDetails

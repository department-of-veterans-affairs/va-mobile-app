import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { TextArea, TextView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const AppealDetails: FC = () => {
  const { appeal } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()

  return (
    <TextArea>
      <TextView variant="BitterBoldHeading" mb={theme.dimensions.titleHeaderAndElementMargin} accessibilityRole="header">
        {t('appealDetails.pageTitle')}
      </TextView>
    </TextArea>
  )
}

export default AppealDetails

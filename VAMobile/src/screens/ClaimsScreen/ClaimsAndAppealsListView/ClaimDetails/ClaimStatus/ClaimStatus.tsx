import React, { FC } from 'react'

import { Box, TextArea, TextView } from 'components'
import { ClaimData } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'

type ClaimStatusProps = {
  claim: ClaimData
}

const ClaimStatus: FC<ClaimStatusProps> = ({ claim }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const displayDate = claim && claim.attributes && claim.attributes.maxEstDate ? formatDateMMMMDDYYYY(claim.attributes.maxEstDate) : t('claimDetails.noEstimatedDecisionDate')

  return (
    <Box>
      <TextArea>
        <TextView variant="MobileBody">{t('claimDetails.estimatedDecisionDate')}</TextView>
        <TextView variant="MobileBodyBold">{displayDate}</TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
          {t('claimDetails.weBaseThis')}
        </TextView>
      </TextArea>
    </Box>
  )
}

export default ClaimStatus

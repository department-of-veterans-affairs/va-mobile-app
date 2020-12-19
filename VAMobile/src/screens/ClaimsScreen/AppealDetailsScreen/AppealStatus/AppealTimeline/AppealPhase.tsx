import { TFunction } from 'i18next'
import React, { FC } from 'react'

import { AppealEventData, AppealEventTypes, AppealEventTypesConstants } from 'store/api/types'
import { Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTranslation } from 'utils/hooks'
import PhaseIndicator from '../../../ClaimDetailsScreen/ClaimStatus/ClaimTimeline/PhaseIndicator'
import {formatDateMMMMDDYYYY} from 'utils/formattingUtils'

// TODO: FINISH ME
const getHeading = (type: AppealEventTypes, translation: TFunction): string => {
  switch (type) {
    case AppealEventTypesConstants.claim_decision:
      return translation('appealDetails.claimDecision')
    case AppealEventTypesConstants.hlr_request:
      return translation('appealDetails.higherLevelReviewRequest')
  }
}

type AppealPhaseProps = {
  event: AppealEventData
}

const AppealPhase: FC<AppealPhaseProps> = ({ event }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)

  const formattedDate = formatDateMMMMDDYYYY(event.data)

  return (
    <TextArea>
      <Box flexDirection={'row'}>
        <PhaseIndicator phase={-1} current={0} />
        <Box flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
          <TextView variant={'MobileBodyBold'}>{getHeading(event.type, t)}</TextView>
          <TextView variant={'MobileBody'}>{t('appealDetails.onDate', { date: formattedDate })}</TextView>
        </Box>
      </Box>
    </TextArea>
  )
}

export default AppealPhase

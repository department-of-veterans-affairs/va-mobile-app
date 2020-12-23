import React, { FC } from 'react'

import { AppealAOJTypes, AppealEventData, AppealStatusData, AppealTypes } from 'store/api/types'
import { Box, CollapsibleView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'
import AppealCurrentStatus from './AppealCurrentStatus/AppealCurrentStatus'
import AppealTimeline from './AppealTimeline/AppealTimeline'

type AppealStatusProps = {
  events: Array<AppealEventData>
  status: AppealStatusData
  aoj: AppealAOJTypes
  appealType: AppealTypes
}

const AppealStatus: FC<AppealStatusProps> = ({ events, status, aoj, appealType }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  return (
    <Box>
      <CollapsibleView text={t('appealDetails.viewPastEvents')} inTextArea={false} a11yHint={t('appealDetails.viewPastEventsA11yHint')}>
        <AppealTimeline events={events} />
      </CollapsibleView>
      <Box mt={theme.dimensions.marginBetweenCards}>
        <AppealCurrentStatus status={status} aoj={aoj} appealType={appealType} />
      </Box>
    </Box>
  )
}

export default AppealStatus

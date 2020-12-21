import React, { FC } from 'react'

import { AppealEventData } from 'store/api/types'
import { Box, CollapsibleView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTranslation } from 'utils/hooks'
import AppealTimeline from './AppealTimeline/AppealTimeline'

type AppealStatusProps = {
  events: Array<AppealEventData>
}

const AppealStatus: FC<AppealStatusProps> = ({ events }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)

  return (
    <Box>
      <CollapsibleView text={t('appealDetails.viewPastEvents')} inTextArea={false} a11yHint={t('appealDetails.viewPastEventsA11yHint')}>
        <AppealTimeline events={events} />
      </CollapsibleView>
    </Box>
  )
}

export default AppealStatus

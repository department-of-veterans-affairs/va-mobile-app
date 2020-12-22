import React, { FC } from 'react'

import { AppealEventData } from 'store/api/types'
import { Box } from 'components'
import AppealTimeline from './AppealTimeline/AppealTimeline'

type AppealStatusProps = {
  events: Array<AppealEventData>
}

const AppealStatus: FC<AppealStatusProps> = ({ events }) => {
  return (
    <Box>
      <AppealTimeline events={events} />
    </Box>
  )
}

export default AppealStatus

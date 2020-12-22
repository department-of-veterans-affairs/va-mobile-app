import React, { FC, useEffect } from 'react'

import _ from 'underscore'

import { AppealEventData } from 'store/api/types'
import { Box } from 'components'
import { sortByDate } from 'utils/common'
import AppealPhase from './AppealPhase'

type AppealTimelineProps = {
  events: Array<AppealEventData>
}

const AppealTimeline: FC<AppealTimelineProps> = ({ events }) => {
  useEffect(() => {
    sortByDate(events, 'data')
  }, [events])

  return (
    <Box>
      {_.map(events, (event, index) => {
        return <AppealPhase event={event} key={index} />
      })}
    </Box>
  )
}

export default AppealTimeline

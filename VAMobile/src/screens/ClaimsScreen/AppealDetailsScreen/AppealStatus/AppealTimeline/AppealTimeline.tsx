import React, { FC, useEffect } from 'react'

import _ from 'underscore'

import { AppealEventData } from 'store/api/types'
import { Box } from 'components'
import { sortByDate } from 'utils/common'
import { useTheme } from 'utils/hooks'
import AppealPhase from './AppealPhase'

type AppealTimelineProps = {
  events: Array<AppealEventData>
}

const AppealTimeline: FC<AppealTimelineProps> = ({ events }) => {
  const theme = useTheme()

  useEffect(() => {
    sortByDate(events, 'data')
  }, [events])

  return (
    <Box mt={theme.dimensions.marginBetweenCards} mb={theme.dimensions.marginBetweenCards}>
      {_.map(events, (event, index) => {
        return <AppealPhase event={event} key={index} />
      })}
    </Box>
  )
}

export default AppealTimeline

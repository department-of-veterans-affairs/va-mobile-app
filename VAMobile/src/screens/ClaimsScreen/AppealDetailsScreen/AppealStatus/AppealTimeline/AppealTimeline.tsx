import React, { FC } from 'react'

import { DateTime } from 'luxon'
import _ from 'underscore'

import { AppealEventData } from 'store/api/types'
import { Box } from 'components'
import { useTheme } from 'utils/hooks'
import AppealPhase from './AppealPhase'

type AppealTimelineProps = {
  events: Array<AppealEventData>
}

const AppealTimeline: FC<AppealTimelineProps> = ({ events }) => {
  const theme = useTheme()

  // TODO: FIX
  events.sort((a, b) => {
    const val1: number = a.data ? DateTime.fromISO(a.data).millisecond : Number.POSITIVE_INFINITY
    const val2: number = b.data ? DateTime.fromISO(b.data).millisecond : Number.POSITIVE_INFINITY
    return val1 - val2
  })

  return (
    <Box mt={theme.dimensions.marginBetweenCards} mb={theme.dimensions.marginBetweenCards}>
      {_.map(events, (event, index) => {
        return <AppealPhase event={event} key={index} />
      })}
    </Box>
  )
}

export default AppealTimeline

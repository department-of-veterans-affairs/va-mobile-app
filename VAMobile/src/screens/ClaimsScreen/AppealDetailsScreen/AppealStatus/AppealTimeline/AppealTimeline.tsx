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

  events.sort((a, b) => {
    const d1 = a.data && a.data !== '' ? DateTime.fromISO(a.data).toMillis() : Number.POSITIVE_INFINITY
    const d2 = b.data && b.data !== '' ? DateTime.fromISO(b.data).toMillis() : Number.POSITIVE_INFINITY
    return d1 - d2
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

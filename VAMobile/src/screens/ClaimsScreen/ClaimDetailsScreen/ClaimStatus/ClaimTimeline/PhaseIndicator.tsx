import React, { FC } from 'react'

import { Box, BoxProps } from 'components'
import { VABackgroundColors } from 'styles/theme'
import { getIndicatorCommonProps, getIndicatorValue } from 'utils/claims'
import { useFontScale } from 'utils/hooks'

export type PhaseIndicatorProps = {
  /** phase number of the current indicator */
  phase: number
  /** phase that the current claim is on */
  current: number
}

/** returns green for completed, primary for current and gray for future phases */
const getBgColor = (phase: number, current: number): keyof VABackgroundColors => {
  if (phase < current) {
    return 'completedPhase'
  } else if (phase === current) {
    return 'currentPhase'
  } else {
    return 'upcomingPhase'
  }
}

/**
 * component that renders a step number or completed check for a ClaimPhase in a ClaimTimeline
 * */
const PhaseIndicator: FC<PhaseIndicatorProps> = ({ phase, current }) => {
  const fs = useFontScale()
  const phaseIndicatorBorderWidth = 2

  const boxProps: BoxProps = {
    ...getIndicatorCommonProps(fs),
    backgroundColor: getBgColor(phase, current),
  }

  // current phase has a border, any other phase has no border
  if (phase === current) {
    boxProps.borderColor = 'phaseIndicatorCurrent'
    boxProps.borderWidth = phaseIndicatorBorderWidth
  } else if (phase > current) {
    boxProps.borderColor = 'phaseIndicatorUpcoming'
    boxProps.borderWidth = phaseIndicatorBorderWidth
  }

  return <Box {...boxProps}>{getIndicatorValue(phase, phase < current)}</Box>
}

export default PhaseIndicator

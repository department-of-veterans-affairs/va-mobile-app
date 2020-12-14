import { Box, BoxProps, TextView, VAIcon } from 'components'
import { VABackgroundColors } from 'styles/theme'
import React, { FC, ReactElement } from 'react'
import theme from 'styles/themes/standardTheme'

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

/** returns a number for current or future phase and a checkmark for completed phases */
const getCharacter = (phase: number, current: number): ReactElement => {
  if (phase < current) {
    return (
      <Box justifyContent={'center'} alignItems={'center'}>
        <VAIcon width={15} height={15} name={'CheckMark'} fill="#fff" />
      </Box>
    )
  } else {
    return (
      <TextView variant="ClaimPhase" color="claimPhase" p={5} textAlign={'center'}>
        {phase}
      </TextView>
    )
  }
}

// TODO: update theme with phase indicator values for dims and colors
/**
 * component that renders a step number or completed check for a ClaimPhase in a ClaimTimeline
 * */
const PhaseIndicator: FC<PhaseIndicatorProps> = ({ phase, current }) => {
  const boxProps: BoxProps = {
    backgroundColor: getBgColor(phase, current),
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    mr: theme.dimensions.phaseIndicatorRightMargin,
  }

  // current phase has a border, any other phase has no border
  if (phase === current) {
    boxProps.borderColor = 'claimStatus'
    boxProps.borderWidth = 2
  }
  return <Box {...boxProps}>{getCharacter(phase, current)}</Box>
}

export default PhaseIndicator

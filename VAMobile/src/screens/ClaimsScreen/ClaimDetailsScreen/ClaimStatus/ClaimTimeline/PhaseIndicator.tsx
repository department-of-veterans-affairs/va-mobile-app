import { Box, BoxProps, TextView, VAIcon } from 'components'
import { VABackgroundColors, VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'
import React, { FC, ReactElement } from 'react'

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
const getCharacter = (phase: number, current: number, theme: VATheme): ReactElement => {
  const { phaseIndicatorIconWidth, phaseIndicatorIconHeight, phaseIndicatorTextPadding } = theme.dimensions
  if (phase < current) {
    return (
      <Box justifyContent={'center'} alignItems={'center'}>
        <VAIcon width={phaseIndicatorIconWidth} height={phaseIndicatorIconHeight} name={'CheckMark'} fill="#fff" preventScaling={true} />
      </Box>
    )
  } else {
    return (
      <TextView variant="ClaimPhase" color="claimPhase" p={phaseIndicatorTextPadding} textAlign={'center'} allowFontScaling={false}>
        {phase}
      </TextView>
    )
  }
}

/**
 * component that renders a step number or completed check for a ClaimPhase in a ClaimTimeline
 * */
const PhaseIndicator: FC<PhaseIndicatorProps> = ({ phase, current }) => {
  const theme = useTheme()

  const boxProps: BoxProps = {
    backgroundColor: getBgColor(phase, current),
    height: theme.dimensions.phaseIndicatorDiameter,
    width: theme.dimensions.phaseIndicatorDiameter,
    borderRadius: theme.dimensions.phaseIndicatorDiameter,
    justifyContent: 'center',
    textAlign: 'center',
    mr: theme.dimensions.phaseIndicatorRightMargin,
  }

  // current phase has a border, any other phase has no border
  if (phase === current) {
    boxProps.borderColor = 'phaseIndicatorCurrent'
    boxProps.borderWidth = theme.dimensions.phaseIndicatorBorderWidth
  } else if (phase > current) {
    boxProps.borderColor = 'phaseIndicatorUpcoming'
    boxProps.borderWidth = theme.dimensions.phaseIndicatorBorderWidth
  }

  return <Box {...boxProps}>{getCharacter(phase, current, theme)}</Box>
}

export default PhaseIndicator

import React, { FC, ReactElement } from 'react'

import { Box, BoxProps, TextView, VAIcon } from 'components'
import { VATheme } from 'styles/theme'
import { useFontScale, useTheme } from 'utils/hooks'

export type FileRequestNumberIndicatorProps = {
  /** file request number */
  requestNumber: number
  /** file request has been uploaded */
  fileUploaded?: boolean
}

/** returns a number or checkmark for the file request number indicator*/
const getCharacter = (requestNumber: number, fileUploaded: boolean | undefined, theme: VATheme): ReactElement => {
  const { phaseIndicatorIconWidth, phaseIndicatorIconHeight } = theme.dimensions
  if (fileUploaded) {
    return (
      <Box justifyContent={'center'} alignItems={'center'}>
        <VAIcon width={phaseIndicatorIconWidth} height={phaseIndicatorIconHeight} name={'CheckMark'} fill="#fff" />
      </Box>
    )
  } else {
    return (
      <TextView variant="ClaimPhase" textAlign={'center'}>
        {requestNumber}
      </TextView>
    )
  }
}

/**
 * component that renders a file request number or check for files requested for a claim
 * */
const FileRequestNumberIndicator: FC<FileRequestNumberIndicatorProps> = ({ requestNumber, fileUploaded }) => {
  const theme = useTheme()
  const fs = useFontScale()

  const boxProps: BoxProps = {
    backgroundColor: fileUploaded ? 'completedPhase' : 'currentPhase',
    height: fs(theme.dimensions.phaseIndicatorDiameter),
    width: fs(theme.dimensions.phaseIndicatorDiameter),
    borderRadius: fs(theme.dimensions.phaseIndicatorDiameter),
    justifyContent: 'center',
    textAlign: 'center',
    mr: theme.dimensions.phaseIndicatorRightMargin,
  }

  return <Box {...boxProps}>{getCharacter(requestNumber, fileUploaded, theme)}</Box>
}

export default FileRequestNumberIndicator

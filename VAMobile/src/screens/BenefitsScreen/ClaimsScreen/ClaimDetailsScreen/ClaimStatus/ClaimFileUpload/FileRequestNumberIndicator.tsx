import React, { FC } from 'react'

import { Box, BoxProps } from 'components'
import { getIndicatorCommonProps, getIndicatorValue } from 'utils/claims'
import { useFontScale } from 'utils/hooks'

export type FileRequestNumberIndicatorProps = {
  /** file request number */
  requestNumber: number
  /** file request has been uploaded */
  fileUploaded?: boolean
}

/**
 * component that renders a file request number or check for files requested for a claim
 * */
const FileRequestNumberIndicator: FC<FileRequestNumberIndicatorProps> = ({ requestNumber, fileUploaded }) => {
  const fs = useFontScale()

  const boxProps: BoxProps = {
    ...getIndicatorCommonProps(fs),
    backgroundColor: fileUploaded ? 'completedPhase' : 'currentPhase',
  }

  return <Box {...boxProps}>{getIndicatorValue(requestNumber, fileUploaded || false)}</Box>
}

export default FileRequestNumberIndicator

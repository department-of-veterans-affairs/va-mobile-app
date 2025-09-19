import React from 'react'

import { Box, BoxProps, TextView } from '../../components'
import { useTheme } from '../../utils/hooks'

type FormEmptyPlaceHolderProps = {
  text: string
}
function FormEmptyPlaceHolder({ text }: FormEmptyPlaceHolderProps) {
  const theme = useTheme()
  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderWidth: 'default',
    borderColor: 'primary',
    borderRadius: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    py: theme.dimensions.standardMarginBetween * 2,
  }

  return (
    <Box {...boxProps}>
      <TextView color={'placeholder'}>{text}</TextView>
    </Box>
  )
}

export default FormEmptyPlaceHolder

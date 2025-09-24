import React from 'react'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box } from 'components'
import { useTheme } from 'utils/hooks'

type FormFooterProps = {
  startStatement: (page?: string) => void
}
function FormFooter({ startStatement }: FormFooterProps) {
  const theme = useTheme()

  return (
    <Box mx={theme.dimensions.gutter} my={theme.dimensions.condensedMarginBetween}>
      <Button label={'Start a statement'} onPress={startStatement} />
    </Box>
  )
}
export default FormFooter

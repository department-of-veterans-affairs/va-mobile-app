import React, { FC } from 'react'

import { AlertBox, Box, BoxProps } from 'components'

type AppointmentFlowErrorAlertProps = BoxProps & {
  /** The error message */
  errorMessage?: string
}

// Coomon component to show the appointment flow error alert
const AppointmentFlowErrorAlert: FC<AppointmentFlowErrorAlertProps> = ({ errorMessage, ...boxProps }) => {
  return (
    <>
      {!!errorMessage && (
        <Box {...boxProps}>
          <AlertBox border={'error'} title={errorMessage} />
        </Box>
      )}
    </>
  )
}

export default AppointmentFlowErrorAlert

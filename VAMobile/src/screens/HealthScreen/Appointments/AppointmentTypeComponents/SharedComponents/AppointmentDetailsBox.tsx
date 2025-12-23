import React from 'react'

import { Box, StandardTextAreaBorder } from 'components'

export default function AppointmentDetailsBox({ children }: { children: React.ReactNode }) {
  return (
    <Box backgroundColor="contentBox" {...StandardTextAreaBorder}>
      {children}
    </Box>
  )
}

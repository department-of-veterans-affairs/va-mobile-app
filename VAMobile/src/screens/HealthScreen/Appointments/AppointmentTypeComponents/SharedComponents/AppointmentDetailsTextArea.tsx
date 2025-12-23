import React from 'react'

import { TextArea } from 'components'
import { textAreaBoxProps } from 'screens/HealthScreen/Appointments/AppointmentTypeComponents/helpers'
import { useTheme } from 'utils/hooks'

// For a regular TextArea with noBorder and regular padding, use the TextArea component directly.
export default function AppointmentDetailsTextArea({
  children,
  position,
}: {
  children: React.ReactNode
  position: 'first' | 'last' | undefined // undefined == "middle"
}) {
  const theme = useTheme()
  return (
    <TextArea overrideBoxProps={textAreaBoxProps(theme, position)} noBorder>
      {children}
    </TextArea>
  )
}

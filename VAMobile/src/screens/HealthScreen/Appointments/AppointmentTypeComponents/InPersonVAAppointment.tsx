import React from 'react'

import { AppointmentAttributes } from 'api/types'
import { Box, TextArea } from 'components'
import { AppointmentDetailsSubType, AppointmentDetailsTypeConstants } from 'utils/appointments'

import { AppointmentCalendarButton, AppointmentDateAndTime, AppointmentDetailsModality } from './SharedComponents'

type InPersonVAAppointmentProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
}

function InPersonVAAppointment({ appointmentID, attributes, subType }: InPersonVAAppointmentProps) {
  const type = AppointmentDetailsTypeConstants.InPersonVA
  return (
    <Box>
      <TextArea>
        <AppointmentDetailsModality attributes={attributes} type={type} subType={subType} />
        <AppointmentDateAndTime attributes={attributes} subType={subType} />
        <AppointmentCalendarButton
          appointmentID={appointmentID}
          attributes={attributes}
          subType={subType}
          type={type}
        />
      </TextArea>
    </Box>
  )
}

export default InPersonVAAppointment

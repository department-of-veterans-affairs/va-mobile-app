import React from 'react'

import { AppointmentAttributes } from 'api/types'
import { Box, TextArea } from 'components'
import { AppointmentDetailsSubType, AppointmentDetailsTypeConstants } from 'utils/appointments'

import { AppointmentDetailsModality } from './SharedComponents'

type InPersonVAAppointmentsProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
}

function InPersonVAAppointments({ attributes, subType }: InPersonVAAppointmentsProps) {
  return (
    <Box>
      <TextArea>
        <AppointmentDetailsModality
          attributes={attributes}
          type={AppointmentDetailsTypeConstants.InPersonVA}
          subType={subType}
        />
      </TextArea>
    </Box>
  )
}

export default InPersonVAAppointments

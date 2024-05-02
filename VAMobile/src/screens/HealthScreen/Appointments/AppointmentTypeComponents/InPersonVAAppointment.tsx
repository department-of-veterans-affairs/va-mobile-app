import React from 'react'

import { AppointmentAttributes } from 'api/types'
import { Box, TextArea } from 'components'
import { AppointmentDetailsSubType, AppointmentDetailsTypeConstants } from 'utils/appointments'

import { AppointmentDetailsModality } from './SharedComponents'

type InPersonVAAppointmentProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
}

function InPersonVAAppointment({ attributes, subType }: InPersonVAAppointmentProps) {
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

export default InPersonVAAppointment

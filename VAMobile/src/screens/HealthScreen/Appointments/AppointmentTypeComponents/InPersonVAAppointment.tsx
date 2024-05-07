import React from 'react'

import { AppointmentAttributes } from 'api/types'
import { Box, TextArea } from 'components'
import { AppointmentDetailsSubType, AppointmentDetailsTypeConstants } from 'utils/appointments'

import {
  AppointmentCalendarButton,
  AppointmentDateAndTime,
  AppointmentDetailsModality,
  AppointmentLocation,
  AppointmentPreferredModality,
  AppointmentProvider,
  AppointmentReasonAndComment,
  AppointmentTypeOfCare,
} from './SharedComponents'

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
        <AppointmentDetailsModality attributes={attributes} subType={subType} type={type} />
        <AppointmentDateAndTime attributes={attributes} subType={subType} />
        <AppointmentCalendarButton
          appointmentID={appointmentID}
          attributes={attributes}
          subType={subType}
          type={type}
        />
        <AppointmentTypeOfCare attributes={attributes} subType={subType} type={type} />
        <AppointmentPreferredModality subType={subType} type={type} />
        <AppointmentProvider attributes={attributes} subType={subType} type={type} />
        <AppointmentLocation attributes={attributes} subType={subType} type={type} />
        <AppointmentReasonAndComment attributes={attributes} subType={subType} type={type} />
      </TextArea>
    </Box>
  )
}

export default InPersonVAAppointment

import React from 'react'

import { UseMutateFunction } from '@tanstack/react-query'

import { AppointmentAttributes } from 'api/types'
import { Box, TextArea } from 'components'
import {
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import { featureEnabled } from 'utils/remoteConfig'

import {
  AppointmentCalendarButton,
  AppointmentCancelReschedule,
  AppointmentDateAndTime,
  AppointmentDetailsModality,
  AppointmentLocation,
  AppointmentMedicationWording,
  AppointmentPersonalContactInfo,
  AppointmentProvider,
  AppointmentReasonAndComment,
  AppointmentTypeOfCare,
  CommunityCarePendingLocation,
  DEPRECATED_AppointmentCalendarButton,
} from './SharedComponents'

type CommunityCareAppointmentProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  goBack: () => void
  cancelAppointment?: UseMutateFunction<unknown, Error, string, unknown>
}

function CommunityCareAppointment({
  appointmentID,
  attributes,
  subType,
  goBack,
  cancelAppointment,
}: CommunityCareAppointmentProps) {
  const type = AppointmentDetailsTypeConstants.CommunityCare
  const isPending = [
    AppointmentDetailsSubTypeConstants.CanceledAndPending,
    AppointmentDetailsSubTypeConstants.Pending,
    AppointmentDetailsSubTypeConstants.PastPending,
  ].includes(subType)

  return (
    <Box>
      <TextArea>
        <AppointmentDetailsModality attributes={attributes} subType={subType} type={type} />
        <AppointmentDateAndTime attributes={attributes} subType={subType} />
        {featureEnabled('useOldLinkComponent') ? (
          <DEPRECATED_AppointmentCalendarButton
            appointmentID={appointmentID}
            attributes={attributes}
            subType={subType}
            type={type}
          />
        ) : (
          <AppointmentCalendarButton
            appointmentID={appointmentID}
            attributes={attributes}
            subType={subType}
            type={type}
          />
        )}
        <AppointmentTypeOfCare attributes={attributes} subType={subType} type={type} />
        <AppointmentProvider attributes={attributes} subType={subType} type={type} />
        {isPending ? (
          <CommunityCarePendingLocation attributes={attributes} />
        ) : (
          <AppointmentLocation attributes={attributes} subType={subType} type={type} />
        )}
        <AppointmentReasonAndComment attributes={attributes} subType={subType} type={type} />
        <AppointmentMedicationWording subType={subType} type={type} />
        <AppointmentPersonalContactInfo attributes={attributes} subType={subType} />
        <AppointmentCancelReschedule
          appointmentID={appointmentID}
          attributes={attributes}
          subType={subType}
          type={type}
          goBack={goBack}
          cancelAppointment={cancelAppointment}
        />
      </TextArea>
    </Box>
  )
}

export default CommunityCareAppointment

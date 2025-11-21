import React from 'react'

import { UseMutateFunction } from '@tanstack/react-query'

import { AppointmentAttributes } from 'api/types'
import {
  AppointmentAfterVisitError,
  AppointmentAfterVisitSummary,
  AppointmentCalendarButton,
  AppointmentCancelReschedule,
  AppointmentDateAndTime,
  AppointmentDetailsBox,
  AppointmentDetailsModality,
  AppointmentDetailsTextArea,
  AppointmentJoinSessionPrepareForVideo,
  AppointmentLocation,
  AppointmentMedicationWording,
  AppointmentPersonalContactInfo,
  AppointmentPreferredModality,
  AppointmentProvider,
  AppointmentReasonAndComment,
  AppointmentTravelClaimDetails,
  AppointmentTypeOfCare,
  DEPRECATED_AppointmentCalendarButton,
} from 'screens/HealthScreen/Appointments/AppointmentTypeComponents/SharedComponents'
import { AppointmentDetailsSubType, AppointmentDetailsTypeConstants } from 'utils/appointments'
import { featureEnabled } from 'utils/remoteConfig'

type VideoHomeAppointmentProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  goBack: () => void
  cancelAppointment?: UseMutateFunction<unknown, Error, string, unknown>
}

function VideoHomeAppointment({
  appointmentID,
  attributes,
  subType,
  goBack,
  cancelAppointment,
}: VideoHomeAppointmentProps) {
  const type = AppointmentDetailsTypeConstants.VideoHome
  return (
    <>
      <AppointmentAfterVisitError attributes={attributes} />
      <AppointmentDetailsBox>
        <AppointmentDetailsTextArea position="first">
          <AppointmentDetailsModality attributes={attributes} subType={subType} type={type} />
        </AppointmentDetailsTextArea>
        <AppointmentAfterVisitSummary attributes={attributes} />
        <AppointmentDetailsTextArea position="last">
          <AppointmentJoinSessionPrepareForVideo attributes={attributes} subType={subType} type={type} />
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
          <AppointmentPreferredModality subType={subType} type={type} />
          <AppointmentProvider attributes={attributes} subType={subType} type={type} />
          <AppointmentLocation attributes={attributes} subType={subType} type={type} />
          <AppointmentReasonAndComment attributes={attributes} subType={subType} type={type} />
          <AppointmentMedicationWording subType={subType} type={type} />
          <AppointmentPersonalContactInfo attributes={attributes} subType={subType} />
          <AppointmentTravelClaimDetails appointmentID={appointmentID} attributes={attributes} subType={subType} />
          <AppointmentCancelReschedule
            appointmentID={appointmentID}
            attributes={attributes}
            subType={subType}
            type={type}
            goBack={goBack}
            cancelAppointment={cancelAppointment}
          />
        </AppointmentDetailsTextArea>
      </AppointmentDetailsBox>
    </>
  )
}

export default VideoHomeAppointment

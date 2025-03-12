import React from 'react'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { UseMutateFunction } from '@tanstack/react-query'

import { AppointmentAttributes } from 'api/types'
import { Box, TextArea } from 'components'
import {
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import { useRouteNavigation } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

import {
  AppointmentCalendarButton,
  AppointmentCancelReschedule,
  AppointmentDateAndTime,
  AppointmentDetailsModality,
  AppointmentLocation,
  AppointmentMedicationWording,
  AppointmentPersonalContactInfo,
  AppointmentPreferredModality,
  AppointmentProvider,
  AppointmentReasonAndComment,
  AppointmentTypeOfCare,
  DEPRECATED_AppointmentCalendarButton,
} from './SharedComponents'

type InPersonVAAppointmentProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  goBack: () => void
  cancelAppointment?: UseMutateFunction<unknown, Error, string, unknown>
}

function InPersonVAAppointment({
  appointmentID,
  attributes,
  subType,
  goBack,
  cancelAppointment,
}: InPersonVAAppointmentProps) {
  const type = AppointmentDetailsTypeConstants.InPersonVA
  const navigateTo = useRouteNavigation()

  return (
    <Box>
      <TextArea>
        <AppointmentDetailsModality attributes={attributes} subType={subType} type={type} />
        <AppointmentDateAndTime attributes={attributes} subType={subType} />
        {subType === AppointmentDetailsSubTypeConstants.Past && (
          <Box>
            <Button
              onPress={() => navigateTo('SubmitTravelPayClaimScreen', { appointmentDateTime: attributes.startDateUtc })}
              label="Submit travel claim"
              a11yLabel="Submit travel claim"
            />
          </Box>
        )}
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

export default InPersonVAAppointment

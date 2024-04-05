import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { AppointmentAttributes, AppointmentTypeConstants } from 'store/api/types/AppointmentData'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type ContactInformationProps = {
  attributes: AppointmentAttributes
}

function ContactInformation({ attributes }: ContactInformationProps) {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { patientEmail, patientPhoneNumber, bestTimeToCall, appointmentType, phoneOnly } =
    attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending) {
    return (
      <Box mt={phoneOnly ? undefined : theme.dimensions.standardMarginBetween} testID="apptContactDetailsTestID">
        {(!!patientEmail || !!patientPhoneNumber || !!bestTimeToCall?.length) && (
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appointments.pending.yourContactDetails')}
          </TextView>
        )}
        {!!patientEmail && (
          <TextView variant="MobileBodyBold">
            {`${t('email')}: `}
            <TextView variant="MobileBody">{patientEmail}</TextView>
          </TextView>
        )}
        {!!patientPhoneNumber && (
          <TextView variant="MobileBodyBold">
            {`${t('phoneNumber')}: `}
            <TextView variant="MobileBody">{patientPhoneNumber}</TextView>
          </TextView>
        )}
        {!!bestTimeToCall?.length && appointmentType === AppointmentTypeConstants.COMMUNITY_CARE && (
          <TextView variant="MobileBodyBold">
            {`${t('call')}: `}
            <TextView variant="MobileBody">{bestTimeToCall?.join()}</TextView>
          </TextView>
        )}
      </Box>
    )
  }
  return <></>
}

export default ContactInformation

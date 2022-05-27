import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type ContactInformationProps = {
  attributes: AppointmentAttributes
}

const ContactInformation: FC<ContactInformationProps> = ({ attributes }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { patientEmail, patientPhoneNumber, bestTimeToCall } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending) {
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        {(!!patientEmail || !!patientPhoneNumber || !!bestTimeToCall?.length) && (
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appointments.pending.yourContactDetails')}
          </TextView>
        )}
        {!!patientEmail && (
          <TextView variant="MobileBodyBold">
            {`${tc('email')}: `}
            <TextView variant="MobileBody">{patientEmail}</TextView>
          </TextView>
        )}
        {!!patientPhoneNumber && (
          <TextView variant="MobileBodyBold">
            {`${tc('phoneNumber')}: `}
            <TextView variant="MobileBody">{patientPhoneNumber}</TextView>
          </TextView>
        )}
        {!!bestTimeToCall?.length && (
          <TextView variant="MobileBodyBold">
            {`${tc('call')}: `}
            <TextView variant="MobileBody">{bestTimeToCall?.join(' ')}</TextView>
          </TextView>
        )}
      </Box>
    )
  }
  return <></>
}

export default ContactInformation

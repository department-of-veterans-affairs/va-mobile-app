import React, { FC, ReactElement } from 'react'

import { AppointmentAttributes } from 'store/api'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme, useTranslation } from 'utils/hooks'

type ContactInformationProps = {
  attributes: AppointmentAttributes
}

const ContactInformation: FC<ContactInformationProps> = ({ attributes }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const { patientEmail, patientPhoneNumber, bestTimeToCall } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending) {
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        {(!!patientEmail || !!patientPhoneNumber || !!bestTimeToCall?.length) && (
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {t('appointments.pending.yourContactDetails')}
          </TextView>
        )}
        {!!patientEmail && (
          <TextView variant="MobileBodyBold" color={'primaryTitle'}>
            {`${t('common:email')}: `}
            <TextView variant="MobileBody">{patientEmail}</TextView>
          </TextView>
        )}
        {!!patientPhoneNumber && (
          <TextView variant="MobileBodyBold" color={'primaryTitle'}>
            {`${t('common:phoneNumber')}: `}
            <TextView variant="MobileBody">{patientPhoneNumber}</TextView>
          </TextView>
        )}
        {!!bestTimeToCall?.length && (
          <TextView variant="MobileBodyBold" color={'primaryTitle'}>
            {`${t('common:call')}: `}
            <TextView variant="MobileBody">{bestTimeToCall?.join(' ')}</TextView>
          </TextView>
        )}
      </Box>
    )
  }
  return <></>
}

export default ContactInformation

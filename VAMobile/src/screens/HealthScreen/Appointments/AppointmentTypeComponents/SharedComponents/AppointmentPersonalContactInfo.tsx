import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentAttributes } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { AppointmentDetailsSubType, AppointmentDetailsSubTypeConstants } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type AppointmentPersonalContactInfoProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
}

function AppointmentPersonalContactInfo({ attributes, subType }: AppointmentPersonalContactInfoProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { patientEmail, patientPhoneNumber, bestTimeToCall } = attributes || ({} as AppointmentAttributes)

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
    case AppointmentDetailsSubTypeConstants.Pending:
    case AppointmentDetailsSubTypeConstants.PastPending:
      return (
        <Box>
          {(!!patientEmail || !!patientPhoneNumber || !!bestTimeToCall?.length) && (
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('appointments.pending.yourContactInfo')}
            </TextView>
          )}
          {!!patientEmail && (
            <TextView
              variant="MobileBodyBold"
              mb={
                !!patientPhoneNumber || !!bestTimeToCall?.length
                  ? theme.dimensions.condensedMarginBetween
                  : theme.dimensions.standardMarginBetween
              }>
              {`${t('email')}: `}
              <TextView variant="MobileBody">{patientEmail}</TextView>
            </TextView>
          )}
          {!!patientPhoneNumber && (
            <TextView
              variant="MobileBodyBold"
              mb={
                bestTimeToCall?.length
                  ? theme.dimensions.condensedMarginBetween
                  : theme.dimensions.standardMarginBetween
              }>
              {`${t('appointmentList.phoneOnly')}: `}
              <TextView variant="MobileBody">{patientPhoneNumber}</TextView>
            </TextView>
          )}
          {!!bestTimeToCall?.length && (
            <TextView variant="MobileBodyBold" mb={theme.dimensions.standardMarginBetween}>
              {t('appointments.bestTimeToCall')}
              <TextView variant="MobileBody">{bestTimeToCall?.join(', ')}</TextView>
            </TextView>
          )}
        </Box>
      )
    default:
      return <></>
  }
}

export default AppointmentPersonalContactInfo

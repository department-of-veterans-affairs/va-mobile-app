import React, { FC } from 'react'

import { AppointmentAttributes, AppointmentMessages } from 'store/api'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

type AppointmentReasonProps = {
  attributes: AppointmentAttributes
  messages?: Array<AppointmentMessages>
}

const AppointmentReason: FC<AppointmentReasonProps> = ({ attributes, messages }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const { reason } = attributes || ({} as AppointmentAttributes)

  if (!reason && !messages?.length) {
    return <></>
  }

  // Only use the first index as the remaining items are just the doctors response to the user's concern
  let messageText = !messages?.length ? '' : messages?.[0].attributes?.messageText
  messageText = messageText ? ': ' + messageText : ''

  return (
    <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.standardMarginBetween}>
      <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
        {t('upcomingAppointmentDetails.reason')}
      </TextView>
      <TextView variant="MobileBody">{`${reason || ''}${messageText}`}</TextView>
    </Box>
  )
}

export default AppointmentReason

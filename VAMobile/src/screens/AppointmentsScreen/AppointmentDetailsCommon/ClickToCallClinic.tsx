import React, { FC } from 'react'

import { AppointmentPhone } from 'store/api/types'
import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { getNumbersFromString } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'

type ClickToCallClinicProps = {
  phone: AppointmentPhone | undefined
}

const ClickToCallClinic: FC<ClickToCallClinicProps> = ({ phone }) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()

  if (!phone) {
    return <></>
  }

  const phoneNumber = `${phone.areaCode}-${phone.number}`

  const clickToCallProps: LinkButtonProps = {
    displayedText: phoneNumber,
    linkType: LinkTypeOptionsConstants.call,
    numberOrUrlLink: getNumbersFromString(phoneNumber),
  }

  return (
    <Box mt={theme.dimensions.standardMarginBetween}>
      <ClickForActionLink {...clickToCallProps} {...a11yHintProp(t('upcomingAppointmentDetails.callNumberA11yHint'))} />
    </Box>
  )
}

export default ClickToCallClinic

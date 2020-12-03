import React, { FC, ReactElement } from 'react'

import { AppointmentAddress, AppointmentPhone, AppointmentType, AppointmentTypeConstants } from 'store/api/types'
import { Box, TextView } from 'components'
import { useTheme } from 'utils/hooks'
import ClickToCallClinic from './ClickToCallClinic'

export const isVAOrCCOrVALocation = (appointmentType: AppointmentType): boolean => {
  return (
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE ||
    appointmentType === AppointmentTypeConstants.COMMUNITY_CARE ||
    appointmentType === AppointmentTypeConstants.VA
  )
}

type AppointmentAddressAndNumberProps = {
  appointmentType: AppointmentType
  healthcareService: string
  locationName: string
  address: AppointmentAddress | undefined
  phone: AppointmentPhone | undefined
  noMarginAboveAddressAndNumber: boolean
}

const AppointmentAddressAndNumber: FC<AppointmentAddressAndNumberProps> = ({ appointmentType, healthcareService, locationName, address, phone, noMarginAboveAddressAndNumber }) => {
  const theme = useTheme()
  const appointmentIsAtlas = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS
  const isValidAppointment = isVAOrCCOrVALocation(appointmentType) || appointmentIsAtlas

  if (!isValidAppointment) {
    return <></>
  }

  const VA_VALocation_AppointmentData = (): ReactElement => {
    const isVAOrOnsite = appointmentType === AppointmentTypeConstants.VA || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE
    if (!isVAOrOnsite) {
      return <></>
    }

    return (
      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {healthcareService}
      </TextView>
    )
  }

  const cityStateZip = address ? `${address.city}, ${address.state} ${address.zipCode}` : ''
  const containsProviderNameMargin = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE

  return (
    <Box mt={noMarginAboveAddressAndNumber && !containsProviderNameMargin ? theme.dimensions.marginBetween : 0}>
      <VA_VALocation_AppointmentData />
      {!appointmentIsAtlas && <TextView variant="MobileBody">{locationName}</TextView>}
      {!!address && <TextView variant="MobileBody">{address.line1}</TextView>}
      {!!address && !!address.line2 && <TextView variant="MobileBody">{address.line2}</TextView>}
      {!!address && !!address.line3 && <TextView variant="MobileBody">{address.line3}</TextView>}
      {!!cityStateZip && <TextView variant="MobileBody">{cityStateZip}</TextView>}

      {/*TODO: Replace placeholder with get directions click for action link */}
      <TextView mt={theme.dimensions.marginBetween} color="link" textDecoration="underline">
        GET DIRECTIONS
      </TextView>

      {!appointmentIsAtlas && <ClickToCallClinic phone={phone} />}
    </Box>
  )
}

export default AppointmentAddressAndNumber

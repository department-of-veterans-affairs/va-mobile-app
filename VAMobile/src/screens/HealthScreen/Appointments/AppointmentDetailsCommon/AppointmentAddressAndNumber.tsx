import React, { FC, ReactElement } from 'react'

import { AppointmentAttributes, AppointmentLocation, AppointmentType, AppointmentTypeConstants } from 'store/api/types'
import { Box, ClickForActionLink, ClickToCallPhoneNumber, TextView } from 'components'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { getAllFieldsThatExist } from 'utils/common'
import { getDirectionsUrl } from 'utils/location'
import { useTranslation } from 'utils/hooks'

export const isVAOrCCOrVALocation = (appointmentType: AppointmentType): boolean => {
  return (
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE ||
    appointmentType === AppointmentTypeConstants.COMMUNITY_CARE ||
    appointmentType === AppointmentTypeConstants.VA
  )
}

type AppointmentAddressAndNumberProps = {
  attributes: AppointmentAttributes
}

const AppointmentAddressAndNumber: FC<AppointmentAddressAndNumberProps> = ({ attributes }) => {
  const t = useTranslation()
  const { appointmentType, healthcareService, location, isCovidVaccine } = attributes || ({} as AppointmentAttributes)
  const { address, phone } = location || ({} as AppointmentLocation)

  const appointmentIsAtlas = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS
  const isValidAppointment = isVAOrCCOrVALocation(appointmentType) || appointmentIsAtlas
  if (!isValidAppointment) {
    return <></>
  }

  const getHealthServiceHeaderSection = (): ReactElement => {
    let headerText: string | undefined

    if (isCovidVaccine) {
      headerText = t('health:upcomingAppointments.covidVaccine')
    } else if (appointmentType === AppointmentTypeConstants.VA || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE) {
      headerText = healthcareService
    }

    return (
      <>
        {headerText && (
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {headerText}
          </TextView>
        )}
      </>
    )
  }

  let cityStateZip = address ? `${address.city}, ${address.state} ${address.zipCode}` : ''
  // if no cityStateZip then return empty string
  cityStateZip = cityStateZip === ',' ? '' : cityStateZip

  const testIdFields = !appointmentIsAtlas ? [location.name, address?.street || '', cityStateZip] : [address?.street || '', cityStateZip]
  const testId = getAllFieldsThatExist(testIdFields).join(' ').trim()
  return (
    <Box>
      {getHealthServiceHeaderSection()}
      <Box {...testIdProps(testId)} accessible={true}>
        {!appointmentIsAtlas && !!location?.name && (
          <TextView variant="MobileBody" selectable={true}>
            {location.name}
          </TextView>
        )}
        {!!address?.street && (
          <TextView variant="MobileBody" selectable={true}>
            {address.street}
          </TextView>
        )}
        {!!cityStateZip && (
          <TextView variant="MobileBody" selectable={true}>
            {cityStateZip}
          </TextView>
        )}
      </Box>
      <Box>
        <ClickForActionLink
          displayedText={`${t('common:directions')}`}
          linkType={'directions'}
          numberOrUrlLink={getDirectionsUrl(location)}
          {...a11yHintProp(t('common:directions.a11yHint'))}
        />
      </Box>
      {!appointmentIsAtlas && phone && <ClickToCallPhoneNumber phone={phone} />}
    </Box>
  )
}

export default AppointmentAddressAndNumber

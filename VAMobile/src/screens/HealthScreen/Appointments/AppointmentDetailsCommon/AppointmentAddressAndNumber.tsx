import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement } from 'react'

import { AppointmentAttributes, AppointmentLocation, AppointmentType, AppointmentTypeConstants } from 'store/api/types'
import { Box, ClickForActionLink, ClickToCallPhoneNumber, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { getAllFieldsThatExist } from 'utils/common'
import { getDirectionsUrl } from 'utils/location'
import { isAPendingAppointment } from 'utils/appointments'

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
  const { t } = useTranslation([NAMESPACE.HEALTH, NAMESPACE.COMMON])
  const { appointmentType, healthcareService, location, isCovidVaccine, healthcareProvider } = attributes || ({} as AppointmentAttributes)
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
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {headerText}
          </TextView>
        )}
      </>
    )
  }

  const cityStateZip = address ? `${address.city}, ${address.state} ${address.zipCode}` : ''

  const testIdFields = !appointmentIsAtlas ? [location.name, address?.street || '', cityStateZip] : [address?.street || '', cityStateZip]
  const testId = getAllFieldsThatExist(testIdFields).join(' ').trim()
  const hasNoProvider = !healthcareProvider && !location.name
  const isPendingAppointment = isAPendingAppointment(attributes)

  const getLocationName = () => {
    // hide location.name for pending appointments if its already being shown in `ProviderName.tsx`
    const dontShowForPendingAppt = isPendingAppointment && !healthcareProvider

    if (dontShowForPendingAppt || appointmentIsAtlas || !location?.name) {
      return <></>
    }

    return (
      <TextView variant="MobileBody" selectable={true}>
        {location.name}
      </TextView>
    )
  }

  const getAddress = () => {
    return (
      <>
        {!!address?.street && (
          <TextView variant="MobileBody" selectable={true}>
            {address.street}
          </TextView>
        )}
        {!!address?.city && address?.state && address?.zipCode && (
          <TextView variant="MobileBody" selectable={true}>
            {cityStateZip}
          </TextView>
        )}
      </>
    )
  }

  const getAddressInformation = () => {
    const hasFullAddress = Boolean(address?.street && address?.city && address?.state && address?.zipCode)
    const hasPartialAddress = Boolean(address?.street || (address?.city && address?.state && address?.zipCode))
    const hasLatLong = Boolean(location.lat && location.long)
    const hasMappableAddress = hasFullAddress || hasLatLong
    const hasName = Boolean(location.name)
    const hasPhone = Boolean(!appointmentIsAtlas && phone?.number)

    if (isPendingAppointment && hasNoProvider) {
      return <></>
    }

    let missingAddressMessage = ''
    if (hasPhone && hasName && !hasPartialAddress) {
      missingAddressMessage = t('common:upcomingAppointmentDetails.phoneAndNameButNoAddress')
    } else if (hasPhone && !hasName && !hasPartialAddress) {
      missingAddressMessage = t('common:upcomingAppointmentDetails.phoneButNoNameOrAddress')
    } else if (!hasPhone && !hasPartialAddress) {
      missingAddressMessage = t('common:upcomingAppointmentDetails.noPhoneOrAddress')
    }

    return (
      <>
        <Box {...testIdProps(testId)} accessible={true}>
          {getLocationName()}
          {missingAddressMessage ? <TextView variant="MobileBody">{missingAddressMessage}</TextView> : getAddress()}
        </Box>
        <Box>
          {hasMappableAddress && (
            <ClickForActionLink
              displayedText={`${t('common:directions')}`}
              a11yLabel={`${t('common:directions')}`}
              linkType={'directions'}
              numberOrUrlLink={getDirectionsUrl(location)}
              {...a11yHintProp(t('common:directions.a11yHint'))}
            />
          )}
        </Box>
        {hasPhone && <ClickToCallPhoneNumber phone={phone} />}
      </>
    )
  }
  return (
    <Box>
      {getHealthServiceHeaderSection()}
      {getAddressInformation()}
    </Box>
  )
}

export default AppointmentAddressAndNumber

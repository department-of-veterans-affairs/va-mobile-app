import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement } from 'react'

import { AppointmentAttributes, AppointmentLocation, AppointmentType, AppointmentTypeConstants } from 'store/api/types'
import { Box, ClickForActionLink, ClickToCallPhoneNumber, LinkButtonProps, LinkTypeOptionsConstants, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getAllFieldsThatExist } from 'utils/common'
import { getDirectionsUrl } from 'utils/location'
import { isAPendingAppointment } from 'utils/appointments'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

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
  const { t } = useTranslation(NAMESPACE.COMMON)
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
      headerText = t('upcomingAppointments.covidVaccine')
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
      <TextView variant="MobileBody" selectable={true} accessible={false}>
        {location.name}
      </TextView>
    )
  }

  const getAddress = () => {
    return (
      <>
        {!!address?.street && (
          <TextView variant="MobileBody" selectable={true} accessible={false}>
            {address.street}
          </TextView>
        )}
        {!!address?.city && address?.state && address?.zipCode && (
          <TextView variant="MobileBody" selectable={true} accessible={false}>
            {`${address.city}, ${address.state} ${address.zipCode}`}
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
    const hasName = Boolean(location.name || healthcareProvider)
    const hasPhone = Boolean(!appointmentIsAtlas && phone?.number)

    if (isPendingAppointment && hasNoProvider) {
      return <></>
    }

    let missingAddressMessage = ''
    let missingAddressA11yLabel = ''
    let showFacilityLocatorLink = false
    if (hasPhone && hasName && !hasPartialAddress) {
      missingAddressMessage = t('upcomingAppointmentDetails.phoneAndNameButNoAddress')
    } else if (hasPhone && !hasName && !hasPartialAddress) {
      missingAddressMessage = t('upcomingAppointmentDetails.phoneButNoNameOrAddress')
    } else if (!hasPhone && !hasPartialAddress) {
      missingAddressMessage = t('upcomingAppointmentDetails.noPhoneOrAddress')
      missingAddressA11yLabel = a11yLabelVA(t('upcomingAppointmentDetails.noPhoneOrAddress'))
      showFacilityLocatorLink = true
    }

    const findYourVALocationProps: LinkButtonProps = {
      displayedText: t('upcomingAppointmentDetails.findYourVAFacility'),
      linkType: LinkTypeOptionsConstants.externalLink,
      numberOrUrlLink: WEBVIEW_URL_FACILITY_LOCATOR,
      a11yLabel: a11yLabelVA(t('upcomingAppointmentDetails.findYourVAFacility')),
      accessibilityHint: t('upcomingAppointmentDetails.findYourVAFacility.a11yHint'),
    }

    return (
      <>
        <Box testID={testId} accessible={true}>
          {getLocationName()}
          {missingAddressMessage ? (
            <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={missingAddressA11yLabel || undefined} selectable={true} accessible={false}>
              {missingAddressMessage}
            </TextView>
          ) : (
            getAddress()
          )}
        </Box>
        <Box>
          {hasMappableAddress && (
            <ClickForActionLink
              displayedText={`${t('directions')}`}
              a11yLabel={`${t('directions')}`}
              linkType={'directions'}
              numberOrUrlLink={getDirectionsUrl(location)}
              testID="directionsTestID"
              {...a11yHintProp(t('directions.a11yHint'))}
            />
          )}
          {showFacilityLocatorLink && <ClickForActionLink {...findYourVALocationProps} />}
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

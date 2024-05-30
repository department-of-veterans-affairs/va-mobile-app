import React from 'react'
import { useTranslation } from 'react-i18next'

import { LocationData } from '@department-of-veterans-affairs/mobile-component-library/src/utils/OSfunctions'
import { TFunction } from 'i18next'

import { AppointmentAttributes } from 'api/types'
import { Box, ClickToCallPhoneNumber, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { a11yLabelVA } from 'utils/a11yLabel'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type AppointmentLocationProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}
const locationHeading = (subType: AppointmentDetailsSubType, type: AppointmentDetailsScreenType, t: TFunction) => {
  switch (subType) {
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
    case AppointmentDetailsSubTypeConstants.Pending:
    case AppointmentDetailsSubTypeConstants.PastPending:
      switch (type) {
        case AppointmentDetailsTypeConstants.CommunityCare:
          return undefined
        default:
          return t('appointments.canceled.whoCanceled.facility')
      }
    default:
      switch (type) {
        case AppointmentDetailsTypeConstants.InPersonVA:
        case AppointmentDetailsTypeConstants.ClaimExam:
        case AppointmentDetailsTypeConstants.VideoVA:
        case AppointmentDetailsTypeConstants.VideoAtlas:
          return t('appointments.location.title')
        default:
          undefined
      }
  }
}

const getLocationNameAddressDirectionsPhone = (
  attributes: AppointmentAttributes,
  type: AppointmentDetailsScreenType,
  t: TFunction,
  theme: VATheme,
) => {
  const { location } = attributes

  const hasFullAddress = Boolean(
    location?.address?.street && location?.address?.city && location?.address?.state && location?.address?.zipCode,
  )
  const hasLatLong = Boolean(location?.lat && location?.long)
  const hasDirectionLink = hasFullAddress || hasLatLong
  const hasPhone = Boolean(location?.phone?.number)
  const locationName = type !== AppointmentDetailsTypeConstants.VideoAtlas ? location?.name : undefined
  let missingBodyText

  if (locationName && hasDirectionLink && !hasPhone) {
    missingBodyText = t('appointments.inPersonVA.missingAddress.hasDirections.noPhone')
  } else if (locationName && hasDirectionLink && hasPhone) {
    missingBodyText = t('appointments.inPersonVA.missingAddress.hasDirections.noAddressOnly')
  } else if (!locationName && hasDirectionLink && !hasPhone) {
    missingBodyText = t('appointments.inPersonVA.missingAddress.hasDirections.noAnything')
  } else if (locationName && !hasDirectionLink && !hasPhone) {
    missingBodyText = t('appointments.inPersonVA.missingAddress.noDirections.noPhone')
  } else if (locationName && !hasDirectionLink && hasPhone) {
    missingBodyText = t('appointments.inPersonVA.missingAddress.noDirections.noAddressOnly')
  } else if (!locationName && !hasDirectionLink && !hasPhone) {
    missingBodyText = t('appointments.inPersonVA.missingAddress.noDirections.noAnything')
  }

  const locationData: LocationData | undefined =
    hasDirectionLink && hasLatLong
      ? { name: location.name, address: location?.address, latitude: location.lat!, longitude: location.long! }
      : hasDirectionLink && hasFullAddress
        ? { name: location.name, address: location.address! }
        : undefined
  return (
    <>
      {locationName ? (
        <TextView variant="MobileBody" selectable={true}>
          {locationName}
        </TextView>
      ) : (
        <></>
      )}
      {hasFullAddress ? (
        <Box>
          <TextView variant="MobileBody" selectable={true}>
            {location.address?.street}
          </TextView>
          <TextView variant="MobileBody" selectable={true} mb={theme.dimensions.condensedMarginBetween}>
            {`${location.address?.city}, ${location.address?.state} ${location.address?.zipCode}`}
          </TextView>
        </Box>
      ) : (
        <TextView
          variant={'MobileBody'}
          selectable={true}
          accessibilityLabel={a11yLabelVA(missingBodyText || '')}
          paragraphSpacing={true}>
          {missingBodyText}
        </TextView>
      )}
      {hasDirectionLink && locationData && (
        <LinkWithAnalytics
          type="directions"
          locationData={locationData}
          text={t('directions')}
          a11yLabel={t('directions')}
          a11yHint={t('directions.a11yHint')}
          testID="directionsTestID"
        />
      )}
      {hasPhone && <ClickToCallPhoneNumber phone={location?.phone} />}
      {!hasFullAddress && !hasPhone && (
        <LinkWithAnalytics
          type="url"
          url={WEBVIEW_URL_FACILITY_LOCATOR}
          text={t('appointments.inPersonVA.missingAddress.goToVALink')}
          a11yLabel={a11yLabelVA(t('appointments.inPersonVA.missingAddress.goToVALink'))}
          a11yHint={t('upcomingAppointmentDetails.findYourVAFacility.a11yHint')}
        />
      )}
    </>
  )
}

const getClinicInfo = (
  attributes: AppointmentAttributes,
  subType: AppointmentDetailsSubType,
  type: AppointmentDetailsScreenType,
  t: TFunction,
  theme: VATheme,
) => {
  const { friendlyLocationName, physicalLocation } = attributes

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
    case AppointmentDetailsSubTypeConstants.Pending:
    case AppointmentDetailsSubTypeConstants.PastPending:
      return undefined
  }

  switch (type) {
    case AppointmentDetailsTypeConstants.InPersonVA:
    case AppointmentDetailsTypeConstants.ClaimExam:
    case AppointmentDetailsTypeConstants.VideoVA:
      return (
        <Box>
          <TextView variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
            {t('appointments.clinic', {
              clinicName:
                friendlyLocationName && friendlyLocationName.length > 1
                  ? friendlyLocationName
                  : t('appointments.notAvailable'),
            })}
          </TextView>
          <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
            {t('appointments.physicalLocation', {
              physicalLocation:
                physicalLocation && physicalLocation.length > 1 ? physicalLocation : t('appointments.notAvailable'),
            })}
          </TextView>
        </Box>
      )
    default:
      return undefined
  }
}

function AppointmentLocation({ attributes, subType, type }: AppointmentLocationProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const heading = locationHeading(subType, type, t)

  if (heading) {
    return (
      <Box>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {heading}
        </TextView>
        {getLocationNameAddressDirectionsPhone(attributes, type, t, theme)}
        {getClinicInfo(attributes, subType, type, t, theme)}
      </Box>
    )
  }

  return <></>
}

export default AppointmentLocation
